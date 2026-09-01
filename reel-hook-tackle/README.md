# Reel Hook Tackle — Catalog Site

One-page catalog/e-commerce-style site for Reel Hook Tackle (fishing gear,
Los Angeles, CA). Plain HTML/CSS/JS — no build step, no framework.

## Files

```
index.html            All page content and structure
styles.css            All styling — navy/white theme, colors as CSS variables
script.js             Mobile nav, "Inquire" buttons, contact form validation
assets/img/           Real product photos (product-N-*.jpeg) + brand SVGs
assets/img/more-photos/  Extra angles of every item, not yet used on the page
```

## Quick start

```
python3 -m http.server 8000
```

then visit `http://localhost:8000/reel-hook-tackle/`.

## To finish setup

1. **Product photos** — done. Every product card now uses a real photo,
   picked from the full set uploaded to this branch and matched to the
   right listing by the branding/text visible in each shot (e.g. "TIAGRA
   50W" vs. "TIAGRA 30W", "SARAGOSA", "T-LICA 16II", "INTERNATIONAL
   30VISW", the Winthrop butt count). Filenames:
   - `product-1-tiagra-50-lrs.jpeg` → Shimano Tiagra 50 LRS
   - `product-2-tiagra-30w.jpeg` → Shimano Tiagra 30W
   - `product-3-saragosa-10000.jpeg` → Shimano Saragosa 10000
   - `product-4-tallica-a-16ii.jpeg` → Shimano Tallica A 16II
   - `product-5-penn-intl-30-wide.jpeg` → Penn International 30 Wide Combo
   - `product-6-winthrop-terminator.jpeg` → Winthrop Terminator Butt
   - `product-7a-penn-30visw-good.jpeg` → Penn 30VISW (good condition)
   - `product-7b-penn-30visw-clutch.jpeg` → Penn 30VISW (needs clutch)
   - `product-7c-penn-20visx.jpeg` → Penn 20VISX
   - `product-7d-penn-16visx.jpeg` → Penn 16VISX

   The Penn fleet photos (7a–7d) are shared group shots of the fleet,
   since the individual mechanical/cosmetic grades aren't visually
   distinguishable — swap in a closer per-reel photo from
   `assets/img/more-photos/` if you want a tighter match per condition
   grade. Every product's remaining angles (group shots, close-ups of
   branding, line spooling) are kept in `assets/img/more-photos/` — not
   currently used on the page, but there if you want a lightbox gallery
   later.

2. **Logo** — replace `assets/img/logo-placeholder.svg` with your real
   fish + rod + hook logo (used in the header, footer, and favicon).

3. **Messenger link** — `https://m.me/ReelHookTackle` is a guess based on
   the business name you gave. Confirm your Facebook Page's actual username
   and update the three `m.me/...` links in `index.html` (hero, contact
   section, footer, sticky button) if it's different.

4. **Google Map** — the embed currently just searches "Los Angeles, CA".
   For a pinned address, go to [Google Maps](https://maps.google.com),
   search your exact address, click **Share → Embed a map**, and paste the
   `src` URL into the `iframe` in the `#contact` section of `index.html`.

5. **Contact form** — validates in the browser but doesn't send anywhere
   yet. In `script.js`, inside `initContactForm()`, wire it to a form
   backend (e.g. [Formspree](https://formspree.io)) or your own API —
   see the comment directly above the submit handler for example code.

## Netlify setup

This repo's existing Netlify site ("mark-web-demo") is linked to the whole
repo with its base/publish directory at the repo root, which serves the
unrelated Apex Mobile Detailing template — **not** this project. Reel Hook
Tackle needs its own Netlify site:

1. In the Netlify dashboard, **Add new site → Import an existing project**
   and pick this GitHub repo.
2. Under **Site settings → Build & deploy → Build settings**, set:
   - **Base directory:** `reel-hook-tackle`
   - **Publish directory:** `reel-hook-tackle` (or `.` if Netlify already
     scopes paths relative to the base directory)
   - **Build command:** leave blank — this is a static site, no build step
3. Give the new site a distinct name (e.g. `reel-hook-tackle`) under
   **Site settings → General → Site details → Change site name**, so its
   URL doesn't collide with `mark-web-demo`.
4. `netlify.toml` in this folder already declares `publish = "."` for when
   the base directory is set to `reel-hook-tackle`, so no further config
   should be needed once the site is linked.

Once linked, that site's deploy previews for PRs touching this folder will
show the actual Reel Hook Tackle catalog, not the Apex template.

## Sections included

- Sticky header with logo, nav, and a call CTA
- Hero with tagline, description, and CTAs (shop catalog / Messenger)
- Trust bar (new & pre-owned, honest condition notes, fair prices, shipping)
- Product catalog grouped into 4 categories, with photo, badges (condition/
  qty), specs, price, and an "Inquire" button that pre-fills the contact
  form's item dropdown
- Contact section: phone, email, Messenger, location, map, and an inquiry
  form
- Footer with quick links and contact info
- Sticky Call / Message buttons (bottom-right, all pages/scroll positions)

