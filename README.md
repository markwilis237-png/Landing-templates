# Local Service Business — Landing Page Template

A clean, mobile-responsive one-page landing site for local service businesses
(plumbers, electricians, contractors, HVAC, landscapers, etc). Plain
HTML/CSS/JS — no build step, no framework, no dependencies to install.

## Files

```
index.html      All page content and structure
styles.css      All styling — colors/fonts are CSS variables at the top
script.js       Mobile nav toggle, gallery lightbox, contact form validation
assets/img/     Placeholder images (SVGs) — swap these for real photos
```

## Quick start

Open `index.html` directly in a browser, or serve the folder locally:

```
python3 -m http.server 8000
```

then visit `http://localhost:8000`.

## Customization checklist (per client)

1. **Business info** — in `index.html`, find/replace every bracketed
   placeholder: `[Business Name]`, `[Tagline]`, `[Phone Number]`,
   `[Service Area]`, `[Address]`, `[Email]`, `(555) 123-4567`, etc.
   Also update the `tel:` and `mailto:` links (there are several —
   header, hero, contact section, and the sticky button).

2. **WhatsApp button** — update the number in the `https://wa.me/...`
   link near the bottom of `index.html` (sticky CTA section). Format is
   country code + number, no `+` or spaces, e.g. `https://wa.me/15551234567`.

3. **Services** — edit the 6 cards in the `#services` section. Change the
   emoji icon, heading, and description for each. Delete or duplicate a
   `.service-card` block to change the count.

4. **Photos** — the demo hero and gallery images are hotlinked from Unsplash
   (`images.unsplash.com/photo-...` URLs). For a real client site, download
   the photos and self-host them instead of hotlinking (faster, and not
   dependent on someone else's URL staying valid):
   - Hero: the `data-hero-src` attribute on `<section id="hero">` in
     `index.html` — loaded via `initHeroImage()` in `script.js`.
   - Gallery: the `src` attribute on each `.gallery-item img`.
   - Every hotlinked image has a local SVG fallback (`assets/img/*.svg`,
     wired via `data-fallback` / `initImageFallbacks()` in `script.js`) that
     it swaps to automatically if the photo URL ever fails to load — so a
     dead link degrades to a labeled placeholder instead of a broken-image
     icon. Keep those SVGs in place, or replace them with your own photos:
     - `hero-bg.svg` → wide background photo, ~1600×900
     - `gallery-1.svg` … `gallery-6.svg` → square-ish job/before-after photos
     - `avatar-1.svg` … `avatar-3.svg` → customer headshots (optional; a
       generic icon works fine too)
     - `logo-placeholder.svg` → your logo (SVG or PNG, transparent background)
     - `og-image.svg` → optional social share preview image (1200×630)

5. **Testimonials** — replace the 3 quotes, names, and cities in the
   `#testimonials` section with real reviews. Always get permission before
   publishing a customer's name or photo.

6. **Google Map** — replace the `iframe src` in the `#contact` section:
   - Go to [Google Maps](https://maps.google.com), search your business
     address, click **Share → Embed a map**, and copy the `src` URL from
     the provided `<iframe>` code.

7. **Contact form** — the form validates in the browser but does **not**
   send anywhere yet. In `script.js`, inside `initContactForm()`, replace
   the simulated submit with either:
   - A form backend service like [Formspree](https://formspree.io) or
     [Netlify Forms](https://www.netlify.com/products/forms/) (no server
     code required), or
   - Your own API endpoint.
   Instructions and example code are commented directly above that spot
   in `script.js`.

8. **Colors & fonts** — open `styles.css` and edit the CSS variables at
   the top of the file (`:root { ... }`). Every color and radius on the
   page is driven from there, so this re-themes the whole site at once.

9. **Page title & meta description** — update the `<title>` and
   `<meta name="description">` tags at the top of `index.html` for SEO.

## Sections included

- Sticky header with logo, nav links, and a call CTA
- Hero with headline, tagline, trust badges, and two CTA buttons
- Services grid (6 cards)
- Stats/trust bar (years in business, jobs completed, rating, etc.)
- Photo gallery with a click-to-enlarge lightbox
- Customer testimonials (3 cards)
- Contact form with client-side validation + embedded Google Map
- Footer with quick links and social links
- Sticky Call / WhatsApp buttons (bottom-right, all pages/scroll positions)

## Browser support

Modern evergreen browsers (Chrome, Firefox, Safari, Edge). Uses standard
CSS Grid/Flexbox and vanilla JS — no polyfills included.
