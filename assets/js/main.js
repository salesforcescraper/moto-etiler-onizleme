/* ==========================================================================
   Moto Etiler — arayüz davranışları
   Bağımlılık yok. Her sayfada güvenle çalışır; eksik öğeleri sessizce atlar.
   ========================================================================== */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Tema değiştirici ---------- */
  function initTheme() {
    var root = document.documentElement;
    var KEY = 'moto-etiler-theme';
    var stored = null;

    try { stored = localStorage.getItem(KEY); } catch (e) { /* gizli mod */ }
    if (stored === 'dark' || stored === 'light') root.setAttribute('data-theme', stored);

    function current() {
      var attr = root.getAttribute('data-theme');
      if (attr) return attr;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    Array.prototype.forEach.call(document.querySelectorAll('[data-theme-toggle]'), function (btn) {
      function sync() {
        var isDark = current() === 'dark';
        btn.setAttribute('aria-pressed', String(isDark));
        btn.setAttribute('title', isDark ? 'Açık temaya geç' : 'Koyu temaya geç');
      }
      sync();
      btn.addEventListener('click', function () {
        var next = current() === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', next);
        try { localStorage.setItem(KEY, next); } catch (e) { /* yok say */ }
        Array.prototype.forEach.call(document.querySelectorAll('[data-theme-toggle]'), function (b) {
          b.setAttribute('aria-pressed', String(next === 'dark'));
          b.setAttribute('title', next === 'dark' ? 'Açık temaya geç' : 'Koyu temaya geç');
        });
      });
    });
  }

  /* ---------- Mobil menü ---------- */
  function initNav() {
    var toggle = document.querySelector('[data-nav-toggle]');
    var menu = document.getElementById('primary-nav');
    if (!toggle || !menu) return;

    function close() {
      menu.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }

    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });

    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) close();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) {
        close();
        toggle.focus();
      }
    });

    document.addEventListener('click', function (e) {
      if (!menu.classList.contains('is-open')) return;
      if (menu.contains(e.target) || toggle.contains(e.target)) return;
      close();
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 900) close();
    });
  }

  /* ---------- Yapışkan başlık gölgesi ---------- */
  function initStickyHeader() {
    var header = document.querySelector('.site-header');
    if (!header) return;
    var ticking = false;

    function update() {
      header.classList.toggle('is-stuck', window.scrollY > 8);
      ticking = false;
    }
    update();
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
    }, { passive: true });
  }

  /* ---------- Aktif menü bağlantısı ---------- */
  function initCurrentLink() {
    var path = window.location.pathname.split('/').pop() || 'index.html';
    Array.prototype.forEach.call(document.querySelectorAll('#primary-nav a'), function (a) {
      var href = a.getAttribute('href');
      if (!href || href.charAt(0) === '#') return;
      if (href.split('#')[0] === path) a.setAttribute('aria-current', 'page');
    });
  }

  /* ---------- Kaydırınca beliren bloklar ---------- */
  function initReveal() {
    var items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    if (reduceMotion || !('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(items, function (el) { el.classList.add('is-visible'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    Array.prototype.forEach.call(items, function (el, i) {
      el.style.transitionDelay = Math.min(i % 4, 3) * 70 + 'ms';
      io.observe(el);
    });
  }

  /* ---------- Sayaç animasyonu ---------- */
  function initCounters() {
    var nums = document.querySelectorAll('[data-count-to]');
    if (!nums.length) return;

    function render(el, value) {
      var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
      el.textContent =
        (el.getAttribute('data-prefix') || '') +
        value.toLocaleString('tr-TR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) +
        (el.getAttribute('data-suffix') || '');
    }

    function run(el) {
      var target = parseFloat(el.getAttribute('data-count-to'));
      if (isNaN(target)) return;
      if (reduceMotion) { render(el, target); return; }

      var duration = 1200;
      var start = null;
      function frame(ts) {
        if (start === null) start = ts;
        var p = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        render(el, target * eased);
        if (p < 1) window.requestAnimationFrame(frame);
      }
      window.requestAnimationFrame(frame);
    }

    if (!('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(nums, run);
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        run(entry.target);
        io.unobserve(entry.target);
      });
    }, { threshold: 0.5 });
    Array.prototype.forEach.call(nums, function (el) { io.observe(el); });
  }

  /* ---------- Envanter filtresi ---------- */
  function initFilters() {
    var group = document.querySelector('[data-filter-group]');
    if (!group) return;

    var items = document.querySelectorAll('[data-category]');
    var counter = document.querySelector('[data-filter-count]');
    var empty = document.querySelector('[data-filter-empty]');

    function apply(value) {
      var shown = 0;
      Array.prototype.forEach.call(items, function (item) {
        var cats = (item.getAttribute('data-category') || '').split(/\s+/);
        var match = value === 'all' || cats.indexOf(value) !== -1;
        item.hidden = !match;
        if (match) shown++;
      });
      if (counter) counter.textContent = String(shown);
      if (empty) empty.hidden = shown !== 0;
    }

    group.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-filter]');
      if (!btn) return;
      Array.prototype.forEach.call(group.querySelectorAll('[data-filter]'), function (b) {
        b.setAttribute('aria-pressed', String(b === btn));
      });
      apply(btn.getAttribute('data-filter'));
    });

    apply('all');
  }

  /* ---------- Form gönderimi (demo) ---------- */
  function initForms() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-demo-form]'), function (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!form.reportValidity()) return;

        var status = form.querySelector('[data-form-status]');
        var submit = form.querySelector('button[type="submit"]');
        var label = submit ? submit.textContent : '';

        if (submit) { submit.disabled = true; submit.textContent = 'Gönderiliyor…'; }

        window.setTimeout(function () {
          if (status) {
            var name = (form.querySelector('[name="ad"]') || {}).value || '';
            status.textContent = (name ? name.split(' ')[0] + ', t' : 'T') +
              'alebiniz alındı. Ekibimiz en geç 1 iş günü içinde sizi arayacak.';
            status.hidden = false;
          }
          form.reset();
          if (submit) { submit.disabled = false; submit.textContent = label; }
          if (status) status.scrollIntoView({ block: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
        }, 700);
      });
    });
  }

  /* ---------- Fotoğraf yuvaları ----------
     Dosya henüz konmadıysa <img>'i kaldırıp altındaki SVG çizimi açıkta bırakır.
     Böylece eksik görsel kırık ikon olarak görünmez. */
  function initPhotoSlots() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-photo-slot]'), function (img) {
      img.addEventListener('error', function () { img.remove(); });
      // defer ile çalıştığımız için hata JS yüklenmeden önce oluşmuş olabilir.
      if (img.complete && img.naturalWidth === 0) img.remove();
    });
  }

  /* ---------- Yıl damgası ---------- */
  function initYear() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-year]'), function (el) {
      el.textContent = String(new Date().getFullYear());
    });
  }

  /* ---------- Başlat ---------- */
  function boot() {
    initTheme();
    initNav();
    initStickyHeader();
    initCurrentLink();
    initReveal();
    initCounters();
    initFilters();
    initForms();
    initPhotoSlots();
    initYear();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
