# Global Trade Distributors — B2B Wholesale Distributor Site

A multi-page catalog-style site for a global B2B sourcing and wholesale
distribution company (UK-registered Ltd, multi-category, multi-country
manufacturer network). Plain HTML/CSS/JS — no build step, no framework,
matching the navy/gold trust-focused style used across this repo's
templates (see `../reel-hook-tackle/`).

## Files

```
index.html                                 Homepage
about.html                                 Company story, sourcing network, vetting
contact.html                               Contact details + quote request form
product.html                               Reusable product detail template
commercial-equipment-machinery.html        Category page (1 of 9)
packaging-printing.html                    Category page
material-handling.html                     Category page
luxury-travel-equipment.html               Category page
vehicle-parts-accessories.html             Category page
metals-metal-scrap.html                    Category page
construction-building-machinery.html       Category page
vehicles-transportation.html               Category page
agricultural-machinery-equipment.html      Category page
styles.css                                 All styling — navy/gold theme, colors as CSS variables
script.js                                  Mobile nav, product gallery, query-param product fill, form validation
assets/img/                                Placeholder SVGs — swap these for real photos/logo
```

## Quick start

```
python3 -m http.server 8000
```

then visit `http://localhost:8000/global-trade-distributors/`.

## How the product pages work

Rather than hand-building a separate detail page per product, every
"Request Quote" / product link on a category page points to the single
`product.html` template with the product name and category in the URL,
e.g.:

```
product.html?name=Farm%20Tractor&category=Agricultural%20Machinery%20%26%20Equipment
```

`script.js` reads those query parameters on load and fills in the page
`<title>`, breadcrumb, category tag, and heading — every element with a
`data-product-name` or `data-product-category` attribute. The specs table
and description stay as generic placeholder text, since real per-product
specs will come later. To link to a new product, just point to
`product.html?name=...&category=...` the same way the existing category
pages do — no new HTML file needed.

The photo gallery on `product.html` (main image + 4 thumbnails) all use
the same placeholder graphic for now; clicking a thumbnail swaps the main
image, so the interaction is already wired up for when real photos are
added.

## Customization checklist

1. **Company details** — search across all files for these placeholders
   and replace them:
   - `Global Trade Distributors` — company name (also update `<title>`
     tags and the `COMPANY` references baked into text)
   - `[00000000]` — Companies House registration number (in every
     footer)
   - `[Address Placeholder]` — registered office / contact address (footer
     + Contact page)
   - `+44 (0) 000 000 0000` / `tel:+440000000000` — phone number (header
     nav CTA is a "Request a Quote" link, not a phone link, but the
     footer and Contact page both show a real phone number to update)
   - `sales@globaltradedistributors.com` — email address
   - `https://wa.me/440000000000` — WhatsApp link (used in the sticky
     button on every page, and the Contact page). Format is country
     code + number, no `+` or spaces.

2. **Logo** — replace `assets/img/logo-placeholder.svg` with your real
   logo (used in the header, footer, and favicon on every page).

3. **Hero / banner background** — `assets/img/hero-bg.svg` is an abstract
   navy/gold placeholder used behind the homepage hero and every interior
   page banner. Swap for a real photo (warehouse, shipping, or product
   photography) if you want something less abstract.

4. **Product photos** — `assets/img/product-placeholder.svg` is used for
   every product card (category pages) and the product gallery
   (`product.html`). Once real product photos are available:
   - Category page cards: replace the `src` on each `.product-photo img`.
   - Product detail page: since `product.html` is shared by every
     product via query params, product-specific photos need either (a)
     a small addition to `script.js` mapping product names to photo
     paths, or (b) duplicating `product.html` per product once real
     photos exist and pricing/specs are being tracked individually. For
     now the placeholder keeps every product page functional out of the
     box.

5. **Products per category** — each category page has 7–8 sample
   products in a `.product-grid`. Add, remove, or rename `.product-card`
   blocks freely — just keep the `product.html?name=...&category=...`
   link format so the quote flow keeps working.

6. **Specs table & description** — `product.html` has generic placeholder
   rows (Origin, MOQ, Packaging, Lead Time, Certification) and two
   placeholder paragraphs. Fill these in with real data once available,
   or leave them as-is until per-product content is ready.

7. **About page** — `about.html` has:
   - A placeholder company story (2 paragraphs) — replace with the real
     history/positioning.
   - A "Sourcing Network" section illustrating a US / UK / Germany
     presence — update the countries and descriptions to match reality.
   - A "Manufacturer Vetting" section (factory audits, QC checks, trade
     references, secure contracts) — adjust to describe your actual
     vetting process.

8. **Contact form & quote forms** — `contact.html`'s quote form and
   every `product.html` quote form validate in the browser (see
   `script.js`, `initForms()`) but don't send anywhere yet. Wire them to
   a form backend (e.g. [Formspree](https://formspree.io) or
   [Netlify Forms](https://www.netlify.com/products/forms/)) or your own
   API — see the comment directly above the submit handler in
   `script.js` for example code.

9. **Google Map** — the embed in `contact.html` currently searches
   "London, UK". For a pinned address, go to
   [Google Maps](https://maps.google.com), search your exact address,
   click **Share → Embed a map**, and paste the `src` URL into the
   `iframe`.

10. **Colors & fonts** — open `styles.css` and edit the CSS variables at
    the top (`:root { ... }`). Every color and radius on the site is
    driven from there.

11. **Page titles & meta descriptions** — each page has its own
    `<title>` and `<meta name="description">` in its `<head>` — update
    for SEO once real copy is finalized.

## Netlify setup

This repo hosts multiple independent templates in separate folders, each
needing its own Netlify site (see `../reel-hook-tackle/README.md` for the
pattern used here):

1. In the Netlify dashboard, **Add new site → Import an existing project**
   and pick this GitHub repo.
2. Under **Site settings → Build & deploy → Build settings**, set:
   - **Base directory:** `global-trade-distributors`
   - **Publish directory:** `.` (relative to the base directory)
   - **Build command:** leave blank — this is a static site, no build step
3. Give the site a distinct name under **Site settings → General → Site
   details → Change site name** so its URL doesn't collide with the
   repo's other templates.

## Sections included

- Sticky header with logo, "Categories" dropdown (all 9 categories),
  and a prominent "Request a Quote" CTA
- Homepage: hero, trust bar (UK Registered / Global Sourcing Network /
  Verified Manufacturers), 9-category grid, "Source → Verify → Ship"
  process section, CTA banner
- Category page template (reused for all 9 categories): intro, 7–8
  sample products with "Request Quote" buttons, "1000+ more products —
  contact us" note
- Product detail template: photo gallery (click-to-swap thumbnails),
  specs table, description, and its own quote request form
- About page: company story, US/UK/Germany sourcing network, manufacturer
  vetting/trust messaging
- Contact page: phone/email/WhatsApp/address, embedded map, and a full
  quote request form (with a product-category dropdown)
- Footer with company registration placeholder, all 9 category quick
  links, and contact info
- Sticky "Request Quote" / WhatsApp buttons (bottom-right, every page)

## Browser support

Modern evergreen browsers (Chrome, Firefox, Safari, Edge). Uses standard
CSS Grid/Flexbox and vanilla JS — no polyfills included.
