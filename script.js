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
  // Carousel slides are excluded: horizontally off-screen slides would never
  // intersect the viewport and would stay invisible.
  var revealTargets = Array.prototype.filter.call(
    document.querySelectorAll(
      '.section__head, .section__body, .tl, .case, .skills__col, .contact__cta, ' +
      '.hero__facts, .rd__intro, .process__step, .rd__note, .offer-card, .carousel'
    ),
    function (el) { return !el.classList.contains('carousel__slide'); }
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

  /* ---- Carousels ---- */
  document.querySelectorAll('[data-carousel]').forEach(function (carousel) {
    var track = carousel.querySelector('[data-carousel-track]');
    var slides = Array.prototype.slice.call(carousel.querySelectorAll('.carousel__slide'));
    var prevBtn = carousel.querySelector('[data-carousel-prev]');
    var nextBtn = carousel.querySelector('[data-carousel-next]');
    var dotsWrap = carousel.querySelector('[data-carousel-dots]');
    // Focus mode dims every slide except the one nearest the centre.
    var focusMode = carousel.hasAttribute('data-carousel-focus');
    if (!track || !slides.length) return;

    var alignCentre = focusMode;

    // Scrolls only the track itself. scrollIntoView() was tried here first, but
    // it scrolls every scrollable ancestor needed to reveal the target — for
    // tall slides (skills, project cases) the page often scrolled vertically
    // instead of the track scrolling horizontally, so the buttons looked dead.
    function scrollToSlide(slide) {
      var trackRect = track.getBoundingClientRect();
      var slideRect = slide.getBoundingClientRect();
      var delta = slideRect.left - trackRect.left;
      if (alignCentre) delta -= (trackRect.width - slideRect.width) / 2;
      track.scrollTo({ left: track.scrollLeft + delta, behavior: 'smooth' });
    }

    var dots = [];
    if (dotsWrap) {
      dots = slides.map(function (_, i) {
        var dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'carousel__dot';
        dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
        dot.addEventListener('click', function () { scrollToSlide(slides[i]); });
        dotsWrap.appendChild(dot);
        return dot;
      });
    }

    // Index of the slide closest to the track's leading edge (or centre in focus mode).
    function activeIndex() {
      var trackRect = track.getBoundingClientRect();
      var anchor = alignCentre ? trackRect.left + trackRect.width / 2 : trackRect.left;
      var closest = 0;
      var closestDist = Infinity;
      slides.forEach(function (slide, i) {
        var r = slide.getBoundingClientRect();
        var point = alignCentre ? r.left + r.width / 2 : r.left;
        var dist = Math.abs(point - anchor);
        if (dist < closestDist) { closestDist = dist; closest = i; }
      });
      return closest;
    }

    function sync() {
      var current = activeIndex();
      dots.forEach(function (dot, i) { dot.classList.toggle('is-active', i === current); });
      if (focusMode) {
        slides.forEach(function (slide, i) {
          slide.classList.toggle('is-focused', i === current);
        });
      }
    }

    function step(dir) {
      var next = Math.min(slides.length - 1, Math.max(0, activeIndex() + dir));
      scrollToSlide(slides[next]);
    }

    if (prevBtn) prevBtn.addEventListener('click', function () { step(-1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { step(1); });

    track.addEventListener('scroll', function () {
      window.clearTimeout(track._scrollTimer);
      track._scrollTimer = window.setTimeout(sync, 80);
    });

    track.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
    });

    window.addEventListener('resize', function () {
      window.clearTimeout(track._resizeTimer);
      track._resizeTimer = window.setTimeout(sync, 150);
    });

    sync();
  });

  /* ---- Modals (Contact / Get Quote) ---- */
  var CONTACT_EMAIL = 'SunlightForge@proton.me';

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

      // Collect values by field name; checkboxes contribute only when checked.
      var order = [];
      var values = {};
      Array.prototype.forEach.call(form.elements, function (field) {
        if (!field.name) return;
        if (field.type === 'checkbox' || field.type === 'radio') {
          if (!field.checked) return;
        }
        if (!values[field.name]) { values[field.name] = []; order.push(field.name); }
        values[field.name].push(field.value);
      });

      var labels = {
        name: 'Name', email: 'Email', message: 'Message',
        projectType: 'Project type', budget: 'Budget / timeline', details: 'Project details'
      };
      var lines = order.map(function (key) {
        var label = labels[key] || (key.charAt(0).toUpperCase() + key.slice(1));
        return label + ': ' + values[key].join(', ');
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
