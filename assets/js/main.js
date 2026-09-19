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
      ".service-card, .feature, .channel, .section__head, .about-media__item, .faq__item, .doctor"
    );
    if (!targets.length) return;

    // Без анімації (системне «менше руху» або старий браузер) блоки
    // просто лишаються видимими — клас .reveal їм не потрібен.
    if (reduceMotion || !("IntersectionObserver" in window)) return;

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

    // Після появи елемент має повернути собі власні ефекти. Поки на ньому
    // висить .reveal, той перекриває transition-property (рамка й тінь
    // змінюються рвано, затримка каскаду лишається) і transform: none
    // глушить підйом при наведенні. Тому клас знімаємо, щойно поява
    // закінчилась.
    function release(el) {
      el.classList.remove("reveal", "is-in");
      el.style.transitionDelay = "";
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        el.classList.add("is-in");
        io.unobserve(el);

        var released = false;
        function done() {
          if (released) return;
          released = true;
          el.removeEventListener("transitionend", onEnd);
          release(el);
        }
        function onEnd(ev) {
          if (ev.target === el && ev.propertyName === "transform") done();
        }
        el.addEventListener("transitionend", onEnd);
        setTimeout(done, 1800); // страховка, якщо transitionend не прийде
      });
    }, { threshold: 0.12 });
    targets.forEach(function (el) { io.observe(el); });
  }

  /* ---------- плавне розкриття <details> (FAQ і деталі послуг) ----------
     Нативний <details> перемикається миттєво й анімувати висоту
     його вмісту CSS-ом не дозволяє. Тому клік перехоплюємо й
     анімуємо висоту самого блоку через Web Animations API.
     Без JS або без API все працює як звичайний <details>. */
  function initAccordion() {
    if (reduceMotion) return; // «менше руху» — лишаємо миттєве нативне
    var EASE = "cubic-bezier(.22, .8, .32, 1)";

    document.querySelectorAll(".faq__item, .svc-more").forEach(function (details) {
      var summary = details.querySelector("summary");
      var answer = details.querySelector(".faq__a") || details.querySelector("p");
      if (!summary || !answer || !details.animate) return;

      var expanded = details.open; // логічний стан: куди йде анімація
      var heightAnim = null;
      var fadeAnim = null;

      function stop() {
        if (heightAnim) { heightAnim.cancel(); heightAnim = null; }
        if (fadeAnim) { fadeAnim.cancel(); fadeAnim = null; }
      }

      summary.addEventListener("click", function (e) {
        e.preventDefault(); // клавіатура (Enter/Space) теж дає click

        // Де блок зараз — враховує й клік посеред попередньої анімації.
        var startH = details.getBoundingClientRect().height;
        stop();
        expanded = !expanded;

        // Вміст має бути в розмітці, щоб виміряти повну висоту.
        details.open = true;
        var box = details.getBoundingClientRect();
        var fullH = box.height;
        // Згорнута висота = усе до низу заголовка + нижні padding/border.
        // Міряємо від заголовка, а не віднімаємо висоту відповіді: у відповіді
        // може бути зовнішній відступ (у послугах він є), який така різниця не врахує.
        var cs = getComputedStyle(details);
        var collapsedH = summary.getBoundingClientRect().bottom - box.top +
          parseFloat(cs.paddingBottom) + parseFloat(cs.borderBottomWidth);

        details.classList.toggle("is-collapsing", !expanded);
        details.style.overflow = "hidden";

        var a = details.animate(
          { height: [startH + "px", (expanded ? fullH : collapsedH) + "px"] },
          { duration: expanded ? 420 : 320, easing: EASE, fill: "forwards" }
        );
        heightAnim = a;

        // Закриваючись, відповідь встигає розчинитись до того, як її обріже.
        if (!expanded) {
          fadeAnim = answer.animate(
            { opacity: [1, 0] },
            { duration: 200, easing: "ease-out", fill: "forwards" }
          );
        }

        a.onfinish = function () {
          if (heightAnim !== a) return; // її вже замінила новіша анімація
          details.open = expanded;
          details.classList.remove("is-collapsing");
          details.style.overflow = "";
          stop();
        };
      });
    });
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

  /* ---------- демо-режим (портфоліо) ----------
     data-demo на <html> вмикає режим. Контакти в розмітці справжні
     (для бойового запуску достатньо прибрати атрибут), але поки
     сайт демонстраційний, клік не веде на номери-заглушки й чужі
     акаунти — натомість з'являється повідомлення. Текст береться
     з data-toast банера, тож він уже потрібною мовою. */
  function initDemo() {
    if (!document.documentElement.hasAttribute("data-demo")) return;

    var banner = document.querySelector(".demo-banner");
    var message = (banner && banner.getAttribute("data-toast")) || "Demo";

    var toast = document.createElement("div");
    toast.className = "demo-toast";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    document.body.appendChild(toast);

    var hideTimer = null;
    function show() {
      toast.textContent = message;
      toast.classList.add("is-shown");
      clearTimeout(hideTimer);
      hideTimer = setTimeout(function () { toast.classList.remove("is-shown"); }, 2600);
    }

    document.querySelectorAll("[data-contact]").forEach(function (a) {
      a.addEventListener("click", function (e) {
        e.preventDefault();
        show();
      });
    });
  }

  /* ---------- init ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    initDemo();
    initReveal();
    initAccordion();
    initCounters();
    initHeader();
    var y = document.getElementById("year");
    if (y) y.textContent = new Date().getFullYear();
  });
})();
