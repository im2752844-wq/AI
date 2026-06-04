
function toggleNav() {
  var nav = document.getElementById('mainNav');
  if (!nav) return;
  var btn    = nav.querySelector('.nav__toggle');
  var isOpen = nav.classList.toggle('open');
  /* ACCESSIBILITY: оновлюємо aria-expanded при кожному відкритті/закритті
     Lighthouse перевіряє: якщо aria-expanded="false" завжди — це помилка.
     Тепер значення відповідає реальному стану меню. */
  if (btn) btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
}
document.addEventListener('click', function (e) {
  var nav = document.getElementById('mainNav');
  if (!nav) return;
  if (!nav.contains(e.target)) {
    nav.classList.remove('open');
    var btn = nav.querySelector('.nav__toggle');
    if (btn) btn.setAttribute('aria-expanded', 'false');
  }
});

/* ── 2. ПІДСВІЧУВАННЯ АКТИВНОГО ПУНКТУ МЕНЮ ──────────────── */
(function highlightActivePage() {
  var currentFile = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__list a').forEach(function (link) {
    if (link.getAttribute('href') === currentFile) {
      link.classList.add('nav__link--active');
      link.setAttribute('aria-current', 'page');
    }
  });
})();

/* ── 3. ТЕМА (темна / світла) ────────────────────────────── */
(function initTheme() {
  var saved      = localStorage.getItem('theme');
  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  var theme      = saved || (prefersDark ? 'dark' : 'light');
  applyTheme(theme);
})();

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);

  var btn = document.getElementById('themeToggle');
  if (!btn) return;

  if (theme === 'dark') {
    btn.innerHTML = '☀ Світла';
    btn.title     = 'Увімкнути світлу тему';
  } else {
    btn.innerHTML = '☾ Темна';
    btn.title     = 'Увімкнути темну тему';
  }
}

function toggleTheme() {
  var current = document.documentElement.getAttribute('data-theme');
  applyTheme(current === 'dark' ? 'light' : 'dark');
}


(function initScrollHandlers() {
  var bg        = document.getElementById('parallaxBg');
  var scrollBtn = document.getElementById('scrollTopBtn');
  var ticking   = false;  /* прапорець: чи вже запущений rAF */

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(updateOnScroll);
      ticking = true;
    }
  }

  function updateOnScroll() {
    var scrollY = window.scrollY;

    if (bg) {
      bg.style.transform = 'translateY(' + (scrollY * 0.2) + 'px)';
    }

    /* Кнопка "вгору" */
    if (scrollBtn) {
      if (scrollY > 320) {
        scrollBtn.classList.add('scroll-top--visible');
      } else {
        scrollBtn.classList.remove('scroll-top--visible');
      }
    }

    ticking = false;  /* дозволяємо наступному scroll-event запустити rAF */
  }

  /* Один scroll-listener замість двох в оригіналі */
  window.addEventListener('scroll', onScroll, { passive: true });

  /* Плавний скрол вгору */
  if (scrollBtn) {
    scrollBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
})();

/* ── 5. АНІМАЦІЯ ПОЯВИ ЕЛЕМЕНТІВ (IntersectionObserver) ─────
   Ця частина вже була ефективною в оригіналі.
   IntersectionObserver — правильний підхід: не навантажує scroll.
   Лишаємо без змін, тільки невелике очищення коду.
   ──────────────────────────────────────────────────────────── */
(function initFadeInAnimations() {
  var animatedElements = document.querySelectorAll(
    '.card, .news-article, .section h2, .intro-text, .styled-table, .page-header, .styled-list li'
  );

  if (!animatedElements.length) return;

  animatedElements.forEach(function (el, index) {
    el.classList.add('fade-in');
    el.style.transitionDelay = (index % 8 * 70) + 'ms';
  });

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in--visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  animatedElements.forEach(function (el) {
    observer.observe(el);
  });
})();