/* =============================================================
   Global Trade Distributors — B2B Wholesale Distribution Site
   Vanilla JS only — no build step, no dependencies.
   ============================================================= */

document.addEventListener('DOMContentLoaded', () => {
  initYear();
  initMobileNav();
  initHeroImage();
  initProductGallery();
  initProductFromQuery();
  initForms();
});

/* ---------- Footer year ---------- */
function initYear() {
  document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
}

/* ---------- Hero background photo (with SVG fallback) ---------- */
function initHeroImage() {
  const hero = document.getElementById('hero');
  const src = hero?.dataset.heroSrc;
  if (!hero || !src) return;

  const preload = new Image();
  preload.onload = () => {
    hero.style.backgroundImage =
      `linear-gradient(180deg, rgba(8,22,39,0.68), rgba(8,22,39,0.88)), url('${src}')`;
  };
  // On error, do nothing — the local hero-bg.svg illustration set inline
  // in the HTML stays as the background.
  preload.src = src;
}

/* ---------- Mobile nav toggle (+ Categories dropdown on tap) ---------- */
function initMobileNav() {
  const toggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  document.querySelectorAll('.nav-dropdown-toggle').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      if (window.matchMedia('(max-width: 720px)').matches) {
        e.preventDefault();
        btn.closest('.nav-dropdown').classList.toggle('is-open');
      }
    });
  });
}

/* ---------- Product photo gallery (thumbnail click swaps main image) ---------- */
function initProductGallery() {
  const mainImg = document.getElementById('gallery-main-img');
  const thumbs = document.querySelectorAll('.product-gallery-thumbs button');
  if (!mainImg || !thumbs.length) return;

  thumbs.forEach((thumb) => {
    thumb.addEventListener('click', () => {
      const img = thumb.querySelector('img');
      if (!img) return;
      mainImg.src = img.src;
      mainImg.alt = img.alt;
      thumbs.forEach((t) => t.classList.remove('is-active'));
      thumb.classList.add('is-active');
    });
  });
}

/* ---------- Product detail page: fill name/category from ?name=&category= ---------- */
function initProductFromQuery() {
  const nameTargets = document.querySelectorAll('[data-product-name]');
  const categoryTargets = document.querySelectorAll('[data-product-category]');
  if (!nameTargets.length && !categoryTargets.length) return;

  const params = new URLSearchParams(window.location.search);
  const name = params.get('name');
  const category = params.get('category');

  if (name) {
    nameTargets.forEach((el) => { el.textContent = name; });
    document.title = `${name} | Global Trade Distributors`;
    const select = document.getElementById('quote-product');
    if (select) select.value = name;
  }
  if (category) {
    categoryTargets.forEach((el) => { el.textContent = category; });
  }
}

/* ---------- Form validation (contact + quote forms) ---------- */
function initForms() {
  document.querySelectorAll('form[data-validate]').forEach((form) => {
    const note = form.querySelector('.form-note');
    if (!note) return;

    const validators = {
      name: (value) => value.trim().length >= 2 || 'Please enter your full name.',
      email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) || 'Please enter a valid email address.',
    };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      note.textContent = '';
      note.className = 'form-note';

      let isValid = true;

      Object.keys(validators).forEach((fieldName) => {
        const field = form.elements[fieldName];
        if (!field) return;
        const errorEl = form.querySelector(`[data-error-for="${fieldName}"]`);
        const result = validators[fieldName](field.value);

        field.closest('.form-row').classList.toggle('has-error', result !== true);
        if (errorEl) errorEl.textContent = result === true ? '' : result;
        if (result !== true) isValid = false;
      });

      if (!isValid) {
        note.textContent = 'Please fix the highlighted fields above.';
        note.classList.add('error');
        return;
      }

      /*
        NOTE: There is no backend wired up yet — this just simulates a
        successful submission so you can test the UI. To actually receive
        quote requests, either:
          1. Add an "action" and "method" attribute and point the form at a
             backend (e.g. Formspree, Netlify Forms, Basin), or
          2. Wire up a fetch() call here to your own API endpoint.
        See README.md for step-by-step instructions.
      */
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalLabel = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';

      await new Promise((resolve) => setTimeout(resolve, 600));

      note.textContent = "Thanks! Your request has been received — our sourcing team will be in touch shortly.";
      note.classList.add('success');
      form.reset();
      submitBtn.disabled = false;
      submitBtn.textContent = originalLabel;
    });
  });
}
