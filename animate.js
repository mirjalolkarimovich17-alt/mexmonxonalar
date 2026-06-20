/* animate.js — iOS-style, repeats every scroll */
(function () {
  'use strict';

  /* ── Page transition overlay ── */
  const overlay = document.createElement('div');
  overlay.id = 'page-overlay';
  document.body.appendChild(overlay);
  window.addEventListener('load', () => overlay.classList.remove('leaving'));
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href]');
    if (!link) return;
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('tel:') ||
        href.startsWith('mailto:') || link.target === '_blank') return;
    e.preventDefault();
    overlay.classList.add('leaving');
    setTimeout(() => { window.location.href = href; }, 340);
  });

  /* ── Scroll reveal — fires EVERY time element enters viewport ── */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('anim-in');
      } else {
        // remove so it animates again next time
        entry.target.classList.remove('anim-in');
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('[data-anim], [data-stagger]').forEach((el) => {
    if (el.dataset.delay) el.style.transitionDelay = el.dataset.delay;
    observer.observe(el);
  });

  /* ── Counter animation (repeats each time) ── */
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = +el.dataset.counter;
      const suffix = el.dataset.suffix || '';
      const duration = 1800;
      const startTime = performance.now();
      function step(now) {
        const p = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(2, -10 * p);
        el.textContent = Math.floor(eased * target) + suffix;
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = target + suffix;
      }
      requestAnimationFrame(step);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-counter]').forEach((el) => {
    counterObserver.observe(el);
  });

  /* ── Parallax background sections ── */
  const parallaxSections = document.querySelectorAll('[data-parallax-bg]');
  function updateParallax() {
    parallaxSections.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const center = rect.top + rect.height / 2 - window.innerHeight / 2;
      el.style.backgroundPositionY = `calc(50% + ${center * 0.25}px)`;
    });
  }
  if (parallaxSections.length) {
    window.addEventListener('scroll', updateParallax, { passive: true });
    updateParallax();
  }

  /* ── Image parallax on hover ── */
  document.querySelectorAll('.parallax-wrap').forEach((wrap) => {
    const img = wrap.querySelector('img');
    if (!img) return;
    wrap.addEventListener('mousemove', (e) => {
      const r = wrap.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      img.style.transform = `scale(1.1) translate(${x * 12}px, ${y * 12}px)`;
    });
    wrap.addEventListener('mouseleave', () => {
      img.style.transform = '';
    });
  });

  /* ── iOS 3D tilt on cards ── */
  document.querySelectorAll('.tilt').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(700px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg) scale(1.03)`;
      card.style.transition = 'transform 0.1s ease';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s cubic-bezier(0.22,1,0.36,1)';
    });
  });

  /* ── Sticky nav + scroll rengi ── */
  const nav = document.getElementById('mainNav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 50);
      const t = Math.min(window.scrollY / 300, 1);
      const r = Math.round(255 - t * 80);   // 255 → 175 (ko'proq qizil kamayadi)
      const g = Math.round(255 - t * 50);   // 255 → 205
      const b = Math.round(255 - t * 20);   // 255 → 235 (ko'k qoladi)
      const a = 0.85 + t * 0.15;
      nav.querySelector('.nav').style.background = `rgba(${r},${g},${b},${a})`;
    }, { passive: true });
  }

  /* ── Press effect on buttons ── */
  document.querySelectorAll('.btn').forEach((btn) => btn.classList.add('press'));

  /* ── Video hero parallax ── */
  const heroVideo = document.querySelector('.hero-video');
  if (heroVideo) {
    window.addEventListener('scroll', () => {
      heroVideo.style.transform = `translateY(${window.scrollY * 0.35}px)`;
    }, { passive: true });
  }

})();
