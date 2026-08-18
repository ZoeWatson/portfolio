/* Zoe Watson — portfolio interactions
   Small, dependency-free, progressive-enhancement only. */
(function () {
  'use strict';

  /* ---- Footer year ---- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- Mobile nav toggle ---- */
  var toggle = document.querySelector('.nav__toggle');
  var menu = document.getElementById('nav-menu');

  function closeMenu() {
    if (!toggle || !menu) return;
    toggle.setAttribute('aria-expanded', 'false');
    menu.classList.remove('is-open');
  }

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      menu.classList.toggle('is-open', !open);
    });

    // Close after choosing a destination
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeMenu();
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });

    // Reset menu state when resizing to desktop
    window.addEventListener('resize', function () {
      if (window.innerWidth > 760) closeMenu();
    });
  }

  /* ---- Scroll reveal (respects reduced-motion) ---- */
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var revealTargets = document.querySelectorAll(
    '.section__head, .section__body, .tl, .case, .skills__col, .contact__cta, .contact__edu, .hero__facts'
  );

  if (prefersReduced || !('IntersectionObserver' in window)) {
    revealTargets.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add('reveal'); });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealTargets.forEach(function (el) { io.observe(el); });
  }

  /* ---- Carousels (Volunteering) ---- */
  document.querySelectorAll('[data-carousel]').forEach(function (carousel) {
    var track = carousel.querySelector('[data-carousel-track]');
    var slides = Array.prototype.slice.call(carousel.querySelectorAll('.carousel__slide'));
    var prevBtn = carousel.querySelector('[data-carousel-prev]');
    var nextBtn = carousel.querySelector('[data-carousel-next]');
    var dotsWrap = carousel.querySelector('[data-carousel-dots]');
    if (!track || !slides.length) return;

    var dots = slides.map(function (_, i) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'carousel__dot';
      dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      dot.addEventListener('click', function () {
        slides[i].scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
      });
      dotsWrap.appendChild(dot);
      return dot;
    });

    function setActiveDot() {
      var trackRect = track.getBoundingClientRect();
      var closest = 0;
      var closestDist = Infinity;
      slides.forEach(function (slide, i) {
        var dist = Math.abs(slide.getBoundingClientRect().left - trackRect.left);
        if (dist < closestDist) { closestDist = dist; closest = i; }
      });
      dots.forEach(function (dot, i) { dot.classList.toggle('is-active', i === closest); });
    }

    function scrollByAmount(dir) {
      var amount = track.clientWidth * 0.9 * dir;
      track.scrollBy({ left: amount, behavior: 'smooth' });
    }

    if (prevBtn) prevBtn.addEventListener('click', function () { scrollByAmount(-1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { scrollByAmount(1); });

    track.addEventListener('scroll', function () {
      window.clearTimeout(track._scrollTimer);
      track._scrollTimer = window.setTimeout(setActiveDot, 80);
    });

    track.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { scrollByAmount(1); }
      if (e.key === 'ArrowLeft') { scrollByAmount(-1); }
    });

    setActiveDot();
  });

  /* ---- Modals (Contact / Get Quote) ---- */
  var CONTACT_EMAIL = 'zwzwatts@gmail.com';

  document.querySelectorAll('[data-modal-open]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var modal = document.getElementById(btn.getAttribute('data-modal-open'));
      if (modal && typeof modal.showModal === 'function') modal.showModal();
    });
  });

  document.querySelectorAll('.modal').forEach(function (modal) {
    modal.querySelectorAll('[data-modal-close]').forEach(function (btn) {
      btn.addEventListener('click', function () { modal.close(); });
    });
    // Close when clicking the backdrop
    modal.addEventListener('click', function (e) {
      if (e.target === modal) modal.close();
    });
  });

  document.querySelectorAll('[data-mailto-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var subject = form.getAttribute('data-mailto-subject') || 'Message from portfolio site';
      var lines = [];
      Array.prototype.forEach.call(form.elements, function (field) {
        if (!field.name) return;
        lines.push(field.name.charAt(0).toUpperCase() + field.name.slice(1) + ': ' + field.value);
      });
      var body = lines.join('\n');
      var mailto = 'mailto:' + CONTACT_EMAIL +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);
      window.location.href = mailto;
      var modal = form.closest('.modal');
      if (modal) modal.close();
      form.reset();
    });
  });
})();
