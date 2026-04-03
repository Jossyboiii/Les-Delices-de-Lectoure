/* ================================================
   Les Délices de Lectoure — JavaScript
   ================================================ */

/* ── Page load fade-in ── */
window.addEventListener('load', () => {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.body.classList.remove('page-loading');
      document.body.classList.add('page-loaded');
    });
  });
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
      setTimeout(() => {
        const navH = navbar.offsetHeight + 16;
        const top  = target.getBoundingClientRect().top + window.pageYOffset - navH;
        window.scrollTo({ top, behavior: 'smooth' });
      }, 0);
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


  /* ── CONTACT FORM (async Formspree) ── */
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('[type="submit"]');
      btn.textContent = 'Envoi en cours…';
      btn.disabled    = true;

      try {
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


  /* ── SCROLL REVEAL ── */
  const revealEls = document.querySelectorAll(
    '.produit-card, .avis-card, .apropos-text, .apropos-img, ' +
    '.contact-info, .contact-form, .facebook-text, .commandes-text, ' +
    '.pourquoi-card, .salon-content'
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

  revealEls.forEach((el, i) => {
    el.style.opacity    = '0';
    el.style.transform  = 'translateY(24px)';
    // Stagger pourquoi cards slightly
    const delay = el.classList.contains('pourquoi-card') ? `${(i % 5) * 0.08}s` : '0s';
    el.style.transition = `opacity 0.55s ease ${delay}, transform 0.55s ease ${delay}`;
    revealObserver.observe(el);
  });


  /* ── OPENING STATUS BADGE ── */
  const statusEl = document.getElementById('openStatus');
  if (statusEl) {
    const now     = new Date();
    const day     = now.getDay(); // 0=Sun 1=Mon 2=Tue 3=Wed 4=Thu 5=Fri 6=Sat
    const minutes = now.getHours() * 60 + now.getMinutes();
    const opens   = 6 * 60 + 30;  // 06:30
    const closes  = 19 * 60 + 30; // 19:30
    const isOpen  = day !== 2 && minutes >= opens && minutes < closes;

    statusEl.textContent = isOpen ? 'Ouvert' : 'Fermé';
    statusEl.classList.add(isOpen ? 'is-open' : 'is-closed');
  }

});
