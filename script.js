/* ================================================
   Les Délices de Lectoure — JavaScript (fixed)
   ================================================ */

/* ── Page load fade-in ── */
window.addEventListener('load', () => {
  document.body.classList.remove('page-loading');
  document.body.classList.add('page-loaded');
});

document.addEventListener('DOMContentLoaded', () => {

  const navbar = document.getElementById('navbar');

  /* ── NAVBAR: shadow on scroll ── */
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });


  /* ── MOBILE MENU TOGGLE ── */
  const navToggle = document.getElementById('navToggle');
  const navMenu   = document.getElementById('navLinks');

  function closeMenu() {
    navMenu.classList.remove('open');
    navToggle.classList.remove('is-open');
    navToggle.querySelectorAll('span').forEach(s => {
      s.style.transform = '';
      s.style.opacity   = '';
    });
  }

  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    navToggle.classList.toggle('is-open', isOpen);
    const spans = navToggle.querySelectorAll('span');
    if (isOpen) {
      spans[0].style.transform = 'translateY(6.5px) rotate(45deg)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'translateY(-6.5px) rotate(-45deg)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });


  /* ── SMOOTH SCROLL ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      closeMenu();
      const offset = navbar.offsetHeight + 8;
      const top    = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });


  /* ── ACTIVE NAV HIGHLIGHT (scroll spy) ── */
  const navLinks = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));

  const sectionLinkMap = [];
  navLinks.forEach(link => {
    const id  = link.getAttribute('href').replace('#', '');
    const sec = document.getElementById(id);
    if (sec) sectionLinkMap.push({ sec, link });
  });

  function updateActiveLink() {
    const trigger = navbar.offsetHeight + 60;
    let active = null;
    sectionLinkMap.forEach(({ sec, link }) => {
      if (sec.getBoundingClientRect().top <= trigger) active = link;
    });
    navLinks.forEach(l => l.classList.remove('active'));
    if (active) active.classList.add('active');
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();


  /* ── CONTACT FORM (async Formspree + reCAPTCHA check) ── */
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (typeof grecaptcha !== 'undefined') {
        const token = grecaptcha.getResponse();
        if (!token) {
          alert("Veuillez confirmer que vous n'êtes pas un robot.");
          return;
        }
      }

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
          if (typeof grecaptcha !== 'undefined') grecaptcha.reset();
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


  /* ── SCROLL REVEAL ── */
  const revealEls = document.querySelectorAll(
    '.produit-card, .avis-card, .apropos-text, .apropos-img, ' +
    '.contact-info, .contact-form, .facebook-text, .commandes-text'
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
 
