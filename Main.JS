/* ==============================================
   main.js
   Підключи до КОЖНОЇ сторінки перед </body>:
   <script src="main.js"></script>
   ============================================== */


/* ================================================
   1. НАВІГАЦІЯ — бургер-меню
   ================================================ */
function toggleNav() {
  document.getElementById('mainNav').classList.toggle('open');
}

document.addEventListener('click', function (e) {
  const nav = document.getElementById('mainNav');
  if (nav && !nav.contains(e.target)) {
    nav.classList.remove('open');
  }
});


/* ================================================
   2. ВИДІЛЕННЯ ПОТОЧНОЇ СТОРІНКИ В НАВІГАЦІЇ
   Автоматично порівнює href посилань з URL сторінки
   ================================================ */
(function highlightActivePage() {
  // Отримуємо ім'я файлу поточної сторінки (напр. "aboutAI.html")
  const currentFile = location.pathname.split('/').pop() || 'index.html';

  document.querySelectorAll('.nav__list a').forEach(function (link) {
    const href = link.getAttribute('href');
    if (href === currentFile) {
      link.classList.add('nav__link--active');
      link.setAttribute('aria-current', 'page');
    }
  });
})();


/* ================================================
   3. ПЕРЕМИКАЧ ТЕМИ (темна / світла)
   Зберігає вибір у localStorage між сесіями
   ================================================ */
(function initTheme() {
  // Перевіряємо збережений вибір, або системні налаштування
  const saved       = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme       = saved || (prefersDark ? 'dark' : 'light');

  applyTheme(theme);
})();

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);

  // Оновлюємо текст кнопки
  const btn = document.getElementById('themeToggle');
  if (!btn) return;

  if (theme === 'dark') {
    btn.innerHTML  = '☀ Світла';
    btn.title      = 'Увімкнути світлу тему';
  } else {
    btn.innerHTML  = '☾ Темна';
    btn.title      = 'Увімкнути темну тему';
  }
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  applyTheme(current === 'dark' ? 'light' : 'dark');
}


/* ================================================
   4. КНОПКА "ВГОРУ"
   З'являється після прокрутки 320px вниз
   ================================================ */
(function initScrollTopButton() {
  const btn = document.getElementById('scrollTopBtn');
  if (!btn) return;

  // Показуємо / ховаємо кнопку залежно від позиції скролу
  window.addEventListener('scroll', function () {
    if (window.scrollY > 320) {
      btn.classList.add('scroll-top--visible');
    } else {
      btn.classList.remove('scroll-top--visible');
    }
  }, { passive: true });

  // Плавний скрол вгору при кліку
  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();


/* ================================================
   5. ПЛАВНА АНІМАЦІЯ ПОЯВИ ЕЛЕМЕНТІВ
   Використовує IntersectionObserver — елементи
   з'являються коли потрапляють у зону видимості
   ================================================ */
(function initFadeInAnimations() {
  // Вибираємо всі елементи, які будуть анімуватись
  const animatedElements = document.querySelectorAll(
    '.card, .news-article, .section h2, .intro-text, .styled-table, .page-header, .styled-list li'
  );

  if (!animatedElements.length) return;

  // Додаємо стартовий клас (невидимий стан)
  animatedElements.forEach(function (el, index) {
    el.classList.add('fade-in');
    // Stagger-ефект: кожна картка з'являється трохи пізніше за попередню
    el.style.transitionDelay = (index % 8 * 70) + 'ms';
  });

  // Observer стежить, коли елемент входить у viewport
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in--visible');
        // Більше не стежимо за цим елементом після появи
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12 // спрацьовує коли 12% елемента видно
  });

  animatedElements.forEach(function (el) {
    observer.observe(el);
  });
})();