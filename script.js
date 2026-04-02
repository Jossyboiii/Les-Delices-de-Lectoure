/* ================================================
   Les Délices de Lectoure — JavaScript
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {

  const navbar = document.getElementById('navbar');

  // ── NAVBAR: shadow on scroll ──
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });


  // ── MOBILE MENU TOGGLE ──
  const navToggle = document.getElementById('navToggle');
  const navMenu   = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    const open = navMenu.classList.toggle('open');
    navToggle.classList.toggle('is-open', open);
    const spans = navToggle.querySelectorAll('span');
    if (open) {
      spans[0].style.transform = 'translateY(6.5px) rotate(45deg)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'translateY(-6.5px) rotate(-45deg)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });

  function closeMenu() {
    navMenu.classList.remove('open');
    navToggle.classList.remove('is-open');
    navToggle.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }


  // ── SMOOTH SCROLL ──
  // Intercepts all anchor clicks and scrolls smoothly,
  // accounting for the fixed navbar height.
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href   = this.getAttribute('href');
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      closeMenu();
      const offset = navbar.offsetHeight + 8; // 8px breathing room
      const top    = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });


  // ── ACTIVE NAV HIGHLIGHT ──
  // Simple, reliable approach: on every scroll tick, find which
  // section's top edge is closest to (and above) the nav bottom.
  // Only sections that have a matching nav link are tracked.
  const navLinks = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));

  // Build a map: section element → nav link
  const sectionLinkMap = [];
  navLinks.forEach(link => {
    const id  = link.getAttribute('href').replace('#', '');
    const sec = document.getElementById(id);
    if (sec) sectionLinkMap.push({ sec, link });
  });

  function updateActiveLink() {
    const trigger = navbar.offsetHeight + 40; // how far from top counts as "active"
    let active = null;

    sectionLinkMap.forEach(({ sec, link }) => {
      const top = sec.getBoundingClientRect().top;
      // Section has scrolled into or past the trigger line
      if (top <= trigger) active = link;
    });

    navLinks.forEach(l => l.classList.remove('active'));
    if (active) active.classList.add('active');
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink(); // run once on load


  // ── CONTACT FORM (async Formspree) ──
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('[type="submit"]');
      try {
        btn.textContent = 'Envoi en cours…';
        btn.disabled    = true;
        const res = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        });
        if (res.ok) {
          form.reset();
          if (success) success.classList.add('visible');
          btn.textContent = 'Message envoyé !';
        } else {
          throw new Error();
        }
      } catch {
        btn.textContent = 'Erreur — réessayez';
        btn.disabled    = false;
      }
    });
  }


  // ── SCROLL REVEAL ──
  const revealEls = document.querySelectorAll(
    '.produit-card, .avis-card, .apropos-text, .apropos-img, .contact-info, .contact-form, .facebook-text, .commandes-text'
  );

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity   = '1';
        entry.target.style.transform = 'translateY(0)';
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealEls.forEach(el => {
    el.style.opacity    = '0';
    el.style.transform  = 'translateY(24px)';
    el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
    revealObserver.observe(el);
  });

});
