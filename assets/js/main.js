/* =========================================================
   ДентаЛюкс — інтерактив
   UA/RU — окремі статичні сторінки (/ та /ru/),
   тому клієнтський i18n не потрібен.
   ========================================================= */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var pageStart = (window.performance && performance.now) ? performance.now() : 0;

  function now() {
    return (window.performance && performance.now) ? performance.now() : Date.now();
  }

  /* ---------- поява блоків під час прокрутки ---------- */
  function initReveal() {
    var targets = document.querySelectorAll(
      ".service-card, .feature, .channel, .section__head, .about-media__item"
    );
    if (!targets.length) return;

    // Сусіди в одній сітці з'являються каскадом: кожен наступний
    // із затримкою 90 мс. Індекс рахуємо в межах батьківського блоку.
    var parents = [];
    var counts = [];
    targets.forEach(function (el) {
      el.classList.add("reveal");
      var p = el.parentElement;
      var i = parents.indexOf(p);
      if (i === -1) {
        parents.push(p);
        counts.push(0);
        i = parents.length - 1;
      }
      el.style.transitionDelay = counts[i] * 90 + "ms";
      counts[i]++;
    });

    if (reduceMotion || !("IntersectionObserver" in window)) {
      targets.forEach(function (el) { el.classList.add("is-in"); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    targets.forEach(function (el) { io.observe(el); });
  }

  /* ---------- лічильники у блоці статистики ---------- */

  // Розряди відокремлюємо звичайним пробілом — так само, як у розмітці.
  function formatNum(n) {
    return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }

  function runCounter(el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    if (isNaN(target)) return;

    var suffix = el.getAttribute("data-suffix") || "";
    var li = el.parentElement;

    // Поки біжать цифри, ширина числа змінюється. Фіксуємо ширину
    // комірки, щоб сусідні показники не зсувалися.
    if (li) li.style.minWidth = li.getBoundingClientRect().width + "px";

    var duration = 1600;
    var start = null;

    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      el.textContent = formatNum(Math.round(target * eased)) + suffix;
      if (p < 1) {
        requestAnimationFrame(step);
      } else if (li) {
        li.style.minWidth = "";
      }
    }
    requestAnimationFrame(step);
  }

  function initCounters() {
    var nums = document.querySelectorAll("[data-count]");
    if (!nums.length) return;

    // Без JS або з «зменшити рух» у розмітці лишається готове число —
    // нічого не робимо.
    if (reduceMotion || !("IntersectionObserver" in window)) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        io.unobserve(entry.target);

        // Статистика в першому екрані видима одразу, але з'являється
        // каскадом (затримка .5s + анімація .85s). Стартуємо відлік
        // під кінець цієї появи, інакше цифри добіжать ще до того,
        // як блок стане видимим.
        var el = entry.target;
        var delay = (now() - pageStart < 1200) ? 700 : 0;
        if (delay) {
          setTimeout(function () { runCounter(el); }, delay);
        } else {
          runCounter(el);
        }
      });
    }, { threshold: 0.6 });

    nums.forEach(function (el) { io.observe(el); });
  }

  /* ---------- тінь у шапки після прокрутки ---------- */
  function initHeader() {
    var header = document.querySelector(".site-header");
    if (!header) return;

    var ticking = false;
    function update() {
      header.classList.toggle("is-scrolled", window.scrollY > 12);
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }, { passive: true });
    update();
  }

  /* ---------- init ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    initReveal();
    initCounters();
    initHeader();
    var y = document.getElementById("year");
    if (y) y.textContent = new Date().getFullYear();
  });
})();
