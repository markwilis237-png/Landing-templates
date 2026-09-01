/* =============================================================
   Reel Hook Tackle — One-Page Catalog Site
   Vanilla JS only — no build step, no dependencies.
   ============================================================= */

document.addEventListener('DOMContentLoaded', () => {
  initYear();
  initMobileNav();
  initInquiryLinks();
  initProductGallery();
  initContactForm();
});

/* ---------- Footer year ---------- */
function initYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
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

/* ---------- "Inquire" buttons: preselect the item in the contact form ---------- */
function initInquiryLinks() {
  const itemSelect = document.getElementById('item');
  document.querySelectorAll('[data-inquiry]').forEach((link) => {
    link.addEventListener('click', () => {
      const itemName = link.dataset.inquiry;
      if (itemSelect) {
        const match = Array.from(itemSelect.options).find((opt) => opt.value === itemName);
        if (match) itemSelect.value = itemName;
      }
    });
  });
}

/* ---------- Product photo galleries (lightbox with prev/next) ---------- */
function initProductGallery() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');
  const photoEls = document.querySelectorAll('.product-photo[data-gallery]');

  if (!lightbox || !lightboxImg || !closeBtn || !photoEls.length) return;

  let currentImages = [];
  let currentName = '';
  let currentIndex = 0;

  function render() {
    lightboxImg.src = currentImages[currentIndex];
    lightboxImg.alt = `${currentName} — photo ${currentIndex + 1} of ${currentImages.length}`;
    lightboxCaption.textContent = `${currentName} — ${currentIndex + 1} / ${currentImages.length}`;
  }

  function open(images, name, startIndex) {
    currentImages = images;
    currentName = name;
    currentIndex = startIndex;
    render();
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lightbox.hidden = true;
    lightboxImg.src = '';
    document.body.style.overflow = '';
  }

  function step(delta) {
    currentIndex = (currentIndex + delta + currentImages.length) % currentImages.length;
    render();
  }

  photoEls.forEach((el) => {
    const images = el.dataset.gallery.split(',').map((src) => src.trim()).filter(Boolean);
    const name = el.dataset.galleryName || '';
    if (!images.length) return;

    el.addEventListener('click', () => open(images, name, 0));
  });

  closeBtn.addEventListener('click', close);
  prevBtn.addEventListener('click', () => step(-1));
  nextBtn.addEventListener('click', () => step(1));

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });

  document.addEventListener('keydown', (e) => {
    if (lightbox.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
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

    note.textContent = "Thanks! Your inquiry has been received — we'll be in touch shortly.";
    note.classList.add('success');
    form.reset();
    submitBtn.disabled = false;
    submitBtn.textContent = 'Send Inquiry';
  });
}
