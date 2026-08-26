/* =============================================================
   Local Service Business — Landing Page Template
   Vanilla JS only — no build step, no dependencies.
   ============================================================= */

document.addEventListener('DOMContentLoaded', () => {
  initYear();
  initMobileNav();
  initHeroImage();
  initImageFallbacks();
  initGalleryLightbox();
  initContactForm();
});

/* ---------- Footer year ---------- */
function initYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

/* ---------- Hero background photo (with SVG fallback) ---------- */
function initHeroImage() {
  const hero = document.getElementById('hero');
  const src = hero?.dataset.heroSrc;
  if (!hero || !src) return;

  const preload = new Image();
  preload.onload = () => {
    hero.style.backgroundImage =
      `linear-gradient(180deg, rgba(10,25,45,0.75), rgba(10,25,45,0.85)), url('${src}')`;
  };
  // On error, do nothing — the local SVG set inline in the HTML stays as the background.
  preload.src = src;
}

/* ---------- Hotlinked photos: fall back to local SVG placeholder on error ---------- */
function initImageFallbacks() {
  document.querySelectorAll('img[data-fallback]').forEach((img) => {
    img.addEventListener('error', () => {
      img.src = img.dataset.fallback;
    }, { once: true });
  });
}

/* ---------- Mobile nav toggle ---------- */
function initMobileNav() {
  const toggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('main-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close menu after tapping a link (mobile UX)
  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ---------- Gallery lightbox ---------- */
function initGalleryLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const closeBtn = document.getElementById('lightbox-close');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (!lightbox || !lightboxImg || !closeBtn) return;

  function openLightbox(imgEl) {
    lightboxImg.src = imgEl.src;
    lightboxImg.alt = imgEl.alt || '';
    lightboxCaption.textContent = imgEl.closest('.gallery-item')?.dataset.caption || '';
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.hidden = true;
    lightboxImg.src = '';
    document.body.style.overflow = '';
  }

  galleryItems.forEach((item) => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img) openLightbox(img);
    });
  });

  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !lightbox.hidden) closeLightbox();
  });
}

/* ---------- Contact form validation ---------- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const note = document.getElementById('form-note');
  if (!form || !note) return;

  const validators = {
    name: (value) => value.trim().length >= 2 || 'Please enter your full name.',
    phone: (value) => /^[0-9+()\-.\s]{7,}$/.test(value.trim()) || 'Please enter a valid phone number.',
    email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) || 'Please enter a valid email address.',
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    note.textContent = '';
    note.className = 'form-note';

    let isValid = true;

    Object.keys(validators).forEach((fieldName) => {
      const field = form.elements[fieldName];
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
      successful submission so you can test the UI. To actually send
      submissions, replace the block below with either:

      1) A form service (no server code needed), e.g. Formspree:
         fetch('https://formspree.io/f/yourFormId', {
           method: 'POST',
           headers: { 'Accept': 'application/json' },
           body: new FormData(form),
         })

      2) Your own API endpoint:
         fetch('/api/contact', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify(Object.fromEntries(new FormData(form))),
         })

      Then handle the response to show a real success/error message.
    */
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    await new Promise((resolve) => setTimeout(resolve, 600)); // simulated delay

    note.textContent = "Thanks! Your request has been received — we'll be in touch shortly.";
    note.classList.add('success');
    form.reset();
    submitBtn.disabled = false;
    submitBtn.textContent = 'Request Free Quote';
  });
}
