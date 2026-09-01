# Reel Hook Tackle — Catalog Site

One-page catalog/e-commerce-style site for Reel Hook Tackle (fishing gear,
Los Angeles, CA). Plain HTML/CSS/JS — no build step, no framework.

## Files

```
index.html      All page content and structure
styles.css      All styling — navy/white theme, colors as CSS variables
script.js       Mobile nav, "Inquire" buttons, contact form validation
assets/img/     Placeholder images (SVGs) — swap for real photos
```

## Quick start

```
python3 -m http.server 8000
```

then visit `http://localhost:8000/reel-hook-tackle/`.

## To finish setup

1. **Product photos** — this build could not pull your chat-attached photos
   into files automatically. Every product card uses a labeled navy/gold
   SVG placeholder in `assets/img/`. Replace the file for each product with
   your real photo **using the same filename** so nothing else needs to
   change:
   - `product-1-tiagra-50-lrs.svg` → Shimano Tiagra 50 LRS
   - `product-2-tiagra-30w.svg` → Shimano Tiagra 30W
   - `product-3-saragosa-10000.svg` → Shimano Saragosa 10000
   - `product-4-tallica-a-16ii.svg` → Shimano Tallica A 16II
   - `product-5-penn-intl-30-wide.svg` → Penn International 30 Wide Combo
   - `product-6-winthrop-terminator.svg` → Winthrop Terminator Butt
   - `product-7a-penn-30visw-good.svg` → Penn 30VISW (good condition)
   - `product-7b-penn-30visw-clutch.svg` → Penn 30VISW (needs clutch)
   - `product-7c-penn-20visx.svg` → Penn 20VISX
   - `product-7d-penn-16visx.svg` → Penn 16VISX

   If your real photo is a `.jpg`/`.png`/`.webp`, update the matching
   `src="assets/img/...svg"` in `index.html` to the new extension.

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

## More products coming

Items 6 (Winthrop Terminator Butts) and 7 (Penn International Reel Fleet)
are already built out with full pricing/specs — only their photos are
placeholders, pending the photos you said you'd send in a follow-up
message.
