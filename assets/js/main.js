/* =========================================================
   ДентаЛюкс — мова + інтерактив
   Перемикання UA/RU без перезавантаження сторінки
   ========================================================= */
(function () {
  "use strict";

  /* ---------- Словники перекладів ---------- */
  var I18N = {
    uk: {
      header_cta: "Записатися",
      hero_badge: "Стоматологія в Одесі",
      hero_title: "Здорова усмішка, якій довіряють",
      hero_slogan: "Сучасне лікування без болю, дбайливе ставлення та чесні ціни. Дбаємо про вашу усмішку щодня.",
      hero_btn_call: "Зателефонувати",
      hero_btn_contacts: "Контакти та адреса",
      stat_years: "років досвіду",
      stat_patients: "щасливих пацієнтів",
      stat_safe: "стерильність",
      hero_card_title: "Безкоштовна консультація",
      hero_card_sub: "Перший огляд та план лікування — у подарунок",

      about_eyebrow: "Про нас",
      about_title: "Стоматологія повного циклу в серці Одеси",
      about_lead: "Ми поєднуємо досвідчених лікарів, сучасне обладнання та індивідуальний підхід до кожного пацієнта. Від профілактики до складної імплантації — усе в одному місці.",

      srv1_t: "Терапія та лікування",
      srv1_d: "Лікування карієсу й пульпіту без болю, художня реставрація зубів сучасними матеріалами.",
      srv2_t: "Імплантація",
      srv2_d: "Відновлення зубів імплантами провідних світових систем із гарантією та довічним сервісом.",
      srv3_t: "Протезування",
      srv3_d: "Коронки, вініри та сучасні протези, що виглядають і відчуваються як власні зуби.",
      srv4_t: "Гігієна та відбілювання",
      srv4_d: "Професійна чистка, видалення нальоту й каменю, безпечне відбілювання усмішки.",
      srv5_t: "Дитяча стоматологія",
      srv5_d: "Дбайливі дитячі лікарі, лікування без стресу та формування здорової звички з дитинства.",
      srv6_t: "Хірургія та ортодонтія",
      srv6_d: "Безпечне видалення, виправлення прикусу брекетами та елайнерами для рівної усмішки.",

      why_eyebrow: "Чому ми",
      why_title: "Причини обрати ДентаЛюкс",
      why1_t: "Лікування без болю",
      why1_d: "Сучасна анестезія та делікатні методики — комфортно навіть для тих, хто боїться стоматологів.",
      why2_t: "Повна стерильність",
      why2_d: "Суворий контроль інфекцій, одноразові набори та сучасні стерилізатори для вашої безпеки.",
      why3_t: "Чесні ціни",
      why3_d: "Прозорий кошторис до початку лікування, без прихованих платежів і нав'язаних послуг.",
      why4_t: "Досвідчена команда",
      why4_d: "Лікарі з багаторічним досвідом, що постійно вдосконалюють кваліфікацію.",

      contacts_eyebrow: "Контакти",
      contacts_title: "Запишіться на прийом",
      contacts_lead: "Зателефонуйте або напишіть нам у зручний месенджер — ми підберемо найкращий час для вашого візиту.",
      contacts_address: "м. Одеса, вул. Прикладна, 1",
      contacts_hours: "Пн–Сб: 9:00–20:00 · Нд: вихідний",
      ch_phone: "Телефон",
      ch_phone_v: "+38 (0XX) XXX-XX-XX",
      ch_write: "Написати у чат",
      ch_follow: "Наші роботи та акції",

      footer_city: "Одеса",
      footer_note: "Стоматологія в Одесі. Усі права захищені."
    },

    ru: {
      header_cta: "Записаться",
      hero_badge: "Стоматология в Одессе",
      hero_title: "Здоровая улыбка, которой доверяют",
      hero_slogan: "Современное лечение без боли, бережное отношение и честные цены. Заботимся о вашей улыбке каждый день.",
      hero_btn_call: "Позвонить",
      hero_btn_contacts: "Контакты и адрес",
      stat_years: "лет опыта",
      stat_patients: "довольных пациентов",
      stat_safe: "стерильность",
      hero_card_title: "Бесплатная консультация",
      hero_card_sub: "Первый осмотр и план лечения — в подарок",

      about_eyebrow: "О нас",
      about_title: "Стоматология полного цикла в сердце Одессы",
      about_lead: "Мы объединяем опытных врачей, современное оборудование и индивидуальный подход к каждому пациенту. От профилактики до сложной имплантации — всё в одном месте.",

      srv1_t: "Терапия и лечение",
      srv1_d: "Лечение кариеса и пульпита без боли, художественная реставрация зубов современными материалами.",
      srv2_t: "Имплантация",
      srv2_d: "Восстановление зубов имплантами ведущих мировых систем с гарантией и пожизненным сервисом.",
      srv3_t: "Протезирование",
      srv3_d: "Коронки, виниры и современные протезы, которые выглядят и ощущаются как собственные зубы.",
      srv4_t: "Гигиена и отбеливание",
      srv4_d: "Профессиональная чистка, удаление налёта и камня, безопасное отбеливание улыбки.",
      srv5_t: "Детская стоматология",
      srv5_d: "Заботливые детские врачи, лечение без стресса и формирование здоровой привычки с детства.",
      srv6_t: "Хирургия и ортодонтия",
      srv6_d: "Безопасное удаление, исправление прикуса брекетами и элайнерами для ровной улыбки.",

      why_eyebrow: "Почему мы",
      why_title: "Причины выбрать ДентаЛюкс",
      why1_t: "Лечение без боли",
      why1_d: "Современная анестезия и деликатные методики — комфортно даже тем, кто боится стоматологов.",
      why2_t: "Полная стерильность",
      why2_d: "Строгий контроль инфекций, одноразовые наборы и современные стерилизаторы для вашей безопасности.",
      why3_t: "Честные цены",
      why3_d: "Прозрачная смета до начала лечения, без скрытых платежей и навязанных услуг.",
      why4_t: "Опытная команда",
      why4_d: "Врачи с многолетним опытом, постоянно повышающие квалификацию.",

      contacts_eyebrow: "Контакты",
      contacts_title: "Запишитесь на приём",
      contacts_lead: "Позвоните или напишите нам в удобный мессенджер — мы подберём лучшее время для вашего визита.",
      contacts_address: "г. Одесса, ул. Прикладная, 1",
      contacts_hours: "Пн–Сб: 9:00–20:00 · Вс: выходной",
      ch_phone: "Телефон",
      ch_phone_v: "+38 (0XX) XXX-XX-XX",
      ch_write: "Написать в чат",
      ch_follow: "Наши работы и акции",

      footer_city: "Одесса",
      footer_note: "Стоматология в Одессе. Все права защищены."
    }
  };

  var META = {
    uk: {
      title: "ДентаЛюкс — стоматологія в Одесі | лікування, імплантація, гігієна",
      desc: "Стоматологія ДентаЛюкс в Одесі: лікування зубів без болю, імплантація, протезування, професійна гігієна та дитяча стоматологія.",
      ogLocale: "uk_UA"
    },
    ru: {
      title: "ДентаЛюкс — стоматология в Одессе | лечение, имплантация, гигиена",
      desc: "Стоматология ДентаЛюкс в Одессе: лечение зубов без боли, имплантация, протезирование, профессиональная гигиена и детская стоматология.",
      ogLocale: "ru_RU"
    }
  };

  var STORAGE_KEY = "dentalux_lang";
  var SUPPORTED = ["uk", "ru"];

  function setMeta(name, value, attr) {
    attr = attr || "name";
    var el = document.querySelector("meta[" + attr + '="' + name + '"]');
    if (el) el.setAttribute("content", value);
  }

  function applyLang(lang) {
    if (SUPPORTED.indexOf(lang) === -1) lang = "uk";
    var dict = I18N[lang];

    // текстові вузли
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (dict[key] != null) el.textContent = dict[key];
    });

    // спец-обробка заголовка hero (акцент на останньому слові)
    var heroTitle = document.querySelector(".hero__title");
    if (heroTitle && dict.hero_title) {
      var words = dict.hero_title.split(" ");
      var last = words.pop();
      heroTitle.innerHTML = words.join(" ") + ' <span class="accent">' + last + "</span>";
    }

    // <html lang> + meta
    document.documentElement.setAttribute("lang", lang);
    document.title = META[lang].title;
    setMeta("description", META[lang].desc);
    setMeta("og:title", META[lang].title, "property");
    setMeta("og:description", META[lang].desc, "property");
    setMeta("og:locale", META[lang].ogLocale, "property");

    // кнопки перемикача
    document.querySelectorAll(".lang-btn").forEach(function (btn) {
      var active = btn.getAttribute("data-lang") === lang;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });

    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
  }

  function initLang() {
    var lang = null;
    // 1) ?lang= у URL (узгоджено з hreflang)
    var params = new URLSearchParams(window.location.search);
    if (params.get("lang")) lang = params.get("lang");
    // 2) збережений вибір
    if (!lang) { try { lang = localStorage.getItem(STORAGE_KEY); } catch (e) {} }
    // 3) мова браузера
    if (!lang) {
      var nav = (navigator.language || "uk").toLowerCase();
      lang = nav.indexOf("ru") === 0 ? "ru" : "uk";
    }
    applyLang(lang);

    document.querySelectorAll(".lang-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        applyLang(btn.getAttribute("data-lang"));
      });
    });
  }

  /* ---------- reveal on scroll ---------- */
  function initReveal() {
    var targets = document.querySelectorAll(".service-card, .feature, .channel, .section__head, .hero__card");
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
    initLang();
    initReveal();
    var y = document.getElementById("year");
    if (y) y.textContent = new Date().getFullYear();
  });
})();
