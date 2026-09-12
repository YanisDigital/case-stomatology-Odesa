/* =========================================================
   ДентаЛюкс — інтерактив
   UA/RU тепер окремі статичні сторінки (/ та /ru/),
   тому клієнтський i18n більше не потрібен.
   ========================================================= */
(function () {
  "use strict";

  /* ---------- reveal on scroll ---------- */
  function initReveal() {
    var targets = document.querySelectorAll(".service-card, .feature, .channel, .section__head, .about-media__item");
    targets.forEach(function (el) { el.classList.add("reveal"); });

    if (!("IntersectionObserver" in window)) {
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

  /* ---------- init ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    initReveal();
    var y = document.getElementById("year");
    if (y) y.textContent = new Date().getFullYear();
  });
})();
