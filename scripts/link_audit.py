#!/usr/bin/env python3
"""
Link audit crawler for a single site.

Crawls a site starting from its homepage, following only internal links
(same registrable domain), and reports:
  - broken links (404s), with the page(s) that link to them
  - redirects and redirect chains (3xx), with source, target, and status
  - 5xx server errors

Respects robots.txt and rate-limits requests to be polite to the server.

Usage:
    python3 scripts/link_audit.py https://zybiopeps.com -o link_audit_report.csv
"""

import argparse
import csv
import sys
import time
import urllib.parse as urlparse
import urllib.robotparser as robotparser
from collections import defaultdict, deque

import requests
from bs4 import BeautifulSoup

DEFAULT_DELAY = 1.5
DEFAULT_TIMEOUT = 15
USER_AGENT = "LinkAuditBot/1.0 (+https://github.com/; polite crawler)"
MAX_REDIRECT_HOPS = 10


def normalize_url(url: str) -> str:
    """Strip fragments, normalize trailing slashes for de-duplication."""
    parsed = urlparse.urlsplit(url)
    parsed = parsed._replace(fragment="")
    path = parsed.path or "/"
    return urlparse.urlunsplit((parsed.scheme, parsed.netloc, path, parsed.query, ""))


def same_site(url: str, root_netloc: str) -> bool:
    netloc = urlparse.urlsplit(url).netloc.lower()
    root_netloc = root_netloc.lower()
    # treat www.example.com and example.com as the same site
    strip_www = lambda h: h[4:] if h.startswith("www.") else h
    return strip_www(netloc) == strip_www(root_netloc)


def is_crawlable_scheme(url: str) -> bool:
    return urlparse.urlsplit(url).scheme in ("http", "https")


class LinkAuditor:
    def __init__(self, start_url: str, delay: float = DEFAULT_DELAY, max_pages: int = None):
        self.start_url = normalize_url(start_url)
        self.root_netloc = urlparse.urlsplit(self.start_url).netloc
        self.delay = delay
        self.max_pages = max_pages

        self.session = requests.Session()
        self.session.headers.update({"User-Agent": USER_AGENT})

        self.robots = robotparser.RobotFileParser()
        robots_url = urlparse.urljoin(self.start_url, "/robots.txt")
        try:
            resp = self.session.get(robots_url, timeout=DEFAULT_TIMEOUT)
            if resp.status_code == 200:
                self.robots.parse(resp.text.splitlines())
            else:
                self.robots.parse([])  # no robots.txt -> allow all
        except requests.RequestException:
            self.robots.parse([])

        self.visited_pages = set()  # pages we've fetched+parsed for outgoing links
        self.checked_links = {}  # url -> (status_code, redirect_chain) already checked
        self.linked_from = defaultdict(set)  # target_url -> set of source pages
        self.issues = []  # list of dicts: source_page, url, status_code, issue_type

    def allowed(self, url: str) -> bool:
        try:
            return self.robots.can_fetch(USER_AGENT, url)
        except Exception:
            return True

    def fetch_page(self, url: str):
        """GET a page we intend to crawl for outgoing links. Returns (final_url, html) or (None, None)."""
        try:
            time.sleep(self.delay)
            resp = self.session.get(url, timeout=DEFAULT_TIMEOUT, allow_redirects=True)
        except requests.RequestException as exc:
            print(f"  [!] error fetching {url}: {exc}", file=sys.stderr)
            return None, None
        content_type = resp.headers.get("Content-Type", "")
        if resp.status_code == 200 and "text/html" in content_type:
            return resp.url, resp.text
        return resp.url, None

    def check_link(self, url: str, source_page: str):
        """HEAD/GET-check a link without necessarily crawling it for further links.
        Records redirect chains, 404s, and 5xx into self.issues (deduplicated per URL).
        """
        self.linked_from[url].add(source_page)

        if url in self.checked_links:
            return self.checked_links[url]

        chain = []
        current = url
        final_status = None
        try:
            for hop in range(MAX_REDIRECT_HOPS):
                time.sleep(self.delay)
                try:
                    resp = self.session.get(
                        current, timeout=DEFAULT_TIMEOUT, allow_redirects=False, stream=True
                    )
                    resp.close()
                except requests.RequestException:
                    # some servers reject HEAD-like partial GET oddly; retry with a normal GET
                    resp = self.session.get(current, timeout=DEFAULT_TIMEOUT, allow_redirects=False)

                status = resp.status_code
                if 300 <= status < 400 and "Location" in resp.headers:
                    target = urlparse.urljoin(current, resp.headers["Location"])
                    chain.append((current, target, status))
                    current = target
                    continue
                else:
                    final_status = status
                    break
            else:
                final_status = None  # exceeded max hops -> treat as redirect error

        except requests.RequestException as exc:
            self.checked_links[url] = ("ERROR", chain)
            self.issues.append(
                {
                    "source_page": source_page,
                    "broken_or_redirect_url": url,
                    "status_code": "ERROR",
                    "issue_type": "connection_error",
                    "_detail": str(exc),
                }
            )
            return "ERROR", chain

        self.checked_links[url] = (final_status, chain)

        # classify
        if chain:
            if final_status is None:
                self.issues.append(
                    {
                        "source_page": source_page,
                        "broken_or_redirect_url": url,
                        "status_code": "TOO_MANY_REDIRECTS",
                        "issue_type": "redirect_error",
                    }
                )
            elif len(chain) > 1:
                self.issues.append(
                    {
                        "source_page": source_page,
                        "broken_or_redirect_url": url,
                        "status_code": f"{chain[0][2]} -> ... -> {final_status} ({' -> '.join(t for _, t, _ in chain)})",
                        "issue_type": "redirect_chain",
                    }
                )
            else:
                src, target, status = chain[0]
                self.issues.append(
                    {
                        "source_page": source_page,
                        "broken_or_redirect_url": url,
                        "status_code": f"{status} -> {target}",
                        "issue_type": "redirect",
                    }
                )

        if final_status == 404:
            self.issues.append(
                {
                    "source_page": source_page,
                    "broken_or_redirect_url": url,
                    "status_code": 404,
                    "issue_type": "broken_link_404",
                }
            )
        elif final_status is not None and 400 <= final_status < 500 and final_status != 404:
            self.issues.append(
                {
                    "source_page": source_page,
                    "broken_or_redirect_url": url,
                    "status_code": final_status,
                    "issue_type": "client_error",
                }
            )
        elif final_status is not None and final_status >= 500:
            self.issues.append(
                {
                    "source_page": source_page,
                    "broken_or_redirect_url": url,
                    "status_code": final_status,
                    "issue_type": "server_error_5xx",
                }
            )

        return final_status, chain

    def crawl(self):
        queue = deque([self.start_url])
        queued = {self.start_url}
        pages_crawled = 0

        while queue:
            if self.max_pages and pages_crawled >= self.max_pages:
                break
            page_url = queue.popleft()
            norm = normalize_url(page_url)

            if not self.allowed(page_url):
                print(f"  [robots] disallowed, skipping crawl of: {page_url}")
                continue

            print(f"[{pages_crawled + 1}] Crawling: {page_url}")
            final_url, html = self.fetch_page(page_url)
            pages_crawled += 1
            self.visited_pages.add(norm)

            if html is None:
                continue

            soup = BeautifulSoup(html, "html.parser")
            for a in soup.find_all("a", href=True):
                href = a["href"].strip()
                if not href or href.startswith("#") or href.startswith("mailto:") or href.startswith("tel:") or href.startswith("javascript:"):
                    continue
                absolute = urlparse.urljoin(final_url or page_url, href)
                if not is_crawlable_scheme(absolute):
                    continue
                absolute_norm = normalize_url(absolute)

                if not same_site(absolute_norm, self.root_netloc):
                    continue  # skip external domains entirely (don't even status-check)

                status, chain = self.check_link(absolute_norm, page_url)

                # queue internal pages for further crawling if not yet visited/queued
                # and the link resolved successfully (avoid crawling through broken links)
                is_html_like = not any(
                    absolute_norm.lower().split("?")[0].endswith(ext)
                    for ext in (".pdf", ".jpg", ".jpeg", ".png", ".gif", ".svg", ".zip", ".css", ".js", ".ico", ".webp", ".xml")
                )
                if (
                    is_html_like
                    and absolute_norm not in queued
                    and absolute_norm not in self.visited_pages
                    and isinstance(status, int)
                    and status < 400
                ):
                    queued.add(absolute_norm)
                    queue.append(absolute_norm)

        print(f"\nDone. Crawled {pages_crawled} pages, checked {len(self.checked_links)} unique links.")

    def write_report(self, out_path: str):
        # Merge multiple source pages per broken/redirect URL into one row per (url, issue_type),
        # listing all referring pages.
        merged = defaultdict(lambda: {"status_code": None, "sources": set()})
        for issue in self.issues:
            key = (issue["broken_or_redirect_url"], issue["issue_type"])
            merged[key]["status_code"] = issue["status_code"]
            merged[key]["sources"].add(issue["source_page"])

        rows = []
        for (url, issue_type), data in merged.items():
            # linked_from accumulates every referring page across all visits (including
            # cache hits), so it is the authoritative source list -- issue["source_page"]
            # only reflects the page that triggered the first check of this URL.
            sources = self.linked_from.get(url, data["sources"])
            rows.append(
                {
                    "source_page": "; ".join(sorted(sources)),
                    "broken_or_redirect_url": url,
                    "status_code": data["status_code"],
                    "issue_type": issue_type,
                }
            )

        rows.sort(key=lambda r: (r["issue_type"], r["broken_or_redirect_url"]))

        with open(out_path, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(
                f, fieldnames=["source_page", "broken_or_redirect_url", "status_code", "issue_type"]
            )
            writer.writeheader()
            writer.writerows(rows)

        print(f"Wrote {len(rows)} issue rows to {out_path}")


def main():
    parser = argparse.ArgumentParser(description="Crawl a site and audit for broken links, redirects, and 5xx errors.")
    parser.add_argument("start_url", help="Homepage URL to start crawling from, e.g. https://zybiopeps.com")
    parser.add_argument("-o", "--output", default="link_audit_report.csv", help="Output CSV path")
    parser.add_argument("--delay", type=float, default=DEFAULT_DELAY, help="Delay between requests in seconds (default: 1.5)")
    parser.add_argument("--max-pages", type=int, default=None, help="Optional cap on number of pages crawled")
    args = parser.parse_args()

    auditor = LinkAuditor(args.start_url, delay=args.delay, max_pages=args.max_pages)
    auditor.crawl()
    auditor.write_report(args.output)


if __name__ == "__main__":
    main()
