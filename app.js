/* ============================================================
   B-Boy El Niño — app.js (rebuilt 2026-11-17)
   Preloader · nav · counters · chapters · filters · lightbox
   booking form · Cypher Bot chat · back to top
   ============================================================ */
(function () {
  "use strict";
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- Preloader ---------- */
  var preloader = $("#preloader");
  function hidePreloader() { if (preloader) preloader.classList.add("done"); }
  window.addEventListener("load", function () { setTimeout(hidePreloader, 900); });
  setTimeout(hidePreloader, 3200); /* never trap the page */

  /* ---------- Scroll: progress, header, back-to-top ---------- */
  var progress = $("#scrollProgress");
  var header = $("#siteHeader");
  var backToTop = $("#backToTop");
  function onScroll() {
    var st = window.scrollY || document.documentElement.scrollTop;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = (max > 0 ? (st / max) * 100 : 0) + "%";
    if (header) header.classList.toggle("scrolled", st > 24);
    if (backToTop) backToTop.classList.toggle("show", st > 640);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  if (backToTop) backToTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ---------- Mobile menu ---------- */
  var burger = $("#burgerBtn");
  var navLinks = $("#navLinks");
  function closeMenu() {
    if (!navLinks) return;
    navLinks.classList.remove("open");
    if (burger) burger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }
  if (burger && navLinks) {
    burger.addEventListener("click", function () {
      var open = navLinks.classList.toggle("open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.style.overflow = open ? "hidden" : "";
    });
    $$("a", navLinks).forEach(function (a) { a.addEventListener("click", closeMenu); });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = $$(".reveal");
  if ("IntersectionObserver" in window) {
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); revealObs.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { revealObs.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- Animated counters ---------- */
  function animateCount(el) {
    var target = parseInt(el.getAttribute("data-target"), 10) || 0;
    var suffix = el.getAttribute("data-suffix") || "";
    var start = null, dur = 1500;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + (p === 1 ? suffix : "");
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var counters = $$(".stat-num[data-target]");
  if ("IntersectionObserver" in window && counters.length) {
    var countObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { animateCount(e.target); countObs.unobserve(e.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { countObs.observe(el); });
  }

  /* ---------- Story chapters ---------- */
  var CDN = "https://cdn.jsdelivr.net/gh/leanski-tech/bboy-el-nino-website@main/assets/";
  var CHAPTER_ART = {
    "1": { img: CDN + "img-9bc429c541.svg", badgeTitle: "BOSTON CYPHERS", badgeSub: "Roots Since 1996" },
    "2": { img: CDN + "img-dbd999f646.svg", badgeTitle: "THE SHOCKWAVE", badgeSub: "World Title at Age 11 · 2002" },
    "3": { img: CDN + "gal-5c9adf6863.svg", badgeTitle: "GLOBAL CYPHERS", badgeSub: "35+ Countries · Film & TV" },
    "4": { img: CDN + "img-4715037bf3.svg", badgeTitle: "THE CROWN", badgeSub: "President, Floorlords Crew" }
  };
  var storyImg = $("#storyHeroImg");
  var storyBadge = $("#storyBadge");
  $$(".chapter-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var key = btn.getAttribute("data-chapter");
      $$(".chapter-btn").forEach(function (b) {
        b.classList.toggle("active", b === btn);
        b.setAttribute("aria-selected", b === btn ? "true" : "false");
      });
      $$(".chapter-slide").forEach(function (slide) {
        slide.classList.toggle("active", slide.id === "chapter-" + key);
      });
      var art = CHAPTER_ART[key];
      if (art && storyImg && storyImg.getAttribute("src") !== art.img) {
        storyImg.style.opacity = "0";
        var swap = new Image();
        swap.onload = function () { storyImg.src = art.img; storyImg.style.opacity = "1"; };
        swap.onerror = function () { storyImg.style.opacity = "1"; };
        swap.src = art.img;
      }
      if (art && storyBadge) {
        var t = $(".badge-title", storyBadge), s = $(".badge-sub", storyBadge);
        if (t) t.textContent = art.badgeTitle;
        if (s) s.textContent = art.badgeSub;
      }
    });
  });
  if (storyImg) storyImg.style.transition = "opacity .35s ease";

  /* ---------- Timeline filters ---------- */
  $$(".filter-pill").forEach(function (pill) {
    pill.addEventListener("click", function () {
      $$(".filter-pill").forEach(function (p) { p.classList.toggle("active", p === pill); });
      var f = pill.getAttribute("data-filter");
      $$(".t-item").forEach(function (item) {
        item.classList.toggle("hide", f !== "all" && item.getAttribute("data-category") !== f);
      });
    });
  });

  /* ---------- Video tabs ---------- */
  var vertWrap = $(".videos-vert-wrap");
  $$(".video-tab").forEach(function (tab) {
    tab.addEventListener("click", function () {
      $$(".video-tab").forEach(function (t) { t.classList.toggle("active", t === tab); });
      var f = tab.getAttribute("data-vtab");
      $$(".videos-grid .video-card").forEach(function (card) {
        card.classList.toggle("hide", f !== "all" && card.getAttribute("data-category") !== f);
      });
      if (vertWrap) vertWrap.classList.toggle("hide", !(f === "all" || f === "social"));
    });
  });

  /* ---------- Gallery filters + lightbox ---------- */
  var galItems = $$(".gal-item");
  $$(".g-filter").forEach(function (btn) {
    btn.addEventListener("click", function () {
      $$(".g-filter").forEach(function (b) { b.classList.toggle("active", b === btn); });
      var f = btn.getAttribute("data-gfilter");
      galItems.forEach(function (item) {
        item.classList.toggle("hide", f !== "all" && item.getAttribute("data-cat") !== f);
      });
    });
  });
  var lightbox = $("#lightboxModal");
  var lbImg = $("#lbImg"), lbCaption = $("#lbCaption");
  var lbIndex = 0;
  function visibleItems() { return galItems.filter(function (i) { return !i.classList.contains("hide"); }); }
  function showLb(item) {
    var src = item.getAttribute("data-src") || $("img", item).src;
    lbImg.src = src;
    lbImg.alt = $("img", item).alt || "";
    lbCaption.textContent = item.getAttribute("data-caption") || $("figcaption", item).textContent || "";
  }
  function openLb(item) {
    var vis = visibleItems();
    lbIndex = Math.max(vis.indexOf(item), 0);
    showLb(item);
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function closeLb() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    lbImg.src = "";
  }
  function stepLb(dir) {
    var vis = visibleItems();
    if (!vis.length) return;
    lbIndex = (lbIndex + dir + vis.length) % vis.length;
    showLb(vis[lbIndex]);
  }
  if (lightbox) {
    galItems.forEach(function (item) { item.addEventListener("click", function () { openLb(item); }); });
    $("#lbClose").addEventListener("click", closeLb);
    $("#lbPrev").addEventListener("click", function (e) { e.stopPropagation(); stepLb(-1); });
    $("#lbNext").addEventListener("click", function (e) { e.stopPropagation(); stepLb(1); });
    lightbox.addEventListener("click", function (e) { if (e.target === lightbox) closeLb(); });
    document.addEventListener("keydown", function (e) {
      if (!lightbox.classList.contains("open")) return;
      if (e.key === "Escape") closeLb();
      if (e.key === "ArrowLeft") stepLb(-1);
      if (e.key === "ArrowRight") stepLb(1);
    });
  }

  /* ---------- Service buttons -> booking form ---------- */
  var SERVICE_MAP = {
    "Breaking Workshops": "Breaking Workshops & Masterclasses",
    "Hip Hop History": "Hip Hop History & Cultural Lecture",
    "Event Judging": "Event & Battle Judging",
    "Keynote & Speaking": "Keynote Speaking & Brand Appearance"
  };
  var serviceSelect = $("#bService");
  $$(".btn-service").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var wanted = SERVICE_MAP[btn.getAttribute("data-service")];
      if (wanted && serviceSelect) {
        for (var i = 0; i < serviceSelect.options.length; i++) {
          if (serviceSelect.options[i].value === wanted) { serviceSelect.selectedIndex = i; break; }
        }
      }
      var booking = $("#booking");
      if (booking) booking.scrollIntoView({ behavior: "smooth" });
      setTimeout(function () { var n = $("#bName"); if (n) n.focus({ preventScroll: true }); }, 650);
    });
  });

  /* ---------- Booking form -> email ---------- */
  var form = $("#bookingForm");
  if (form) {
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var fields = {
        name: $("#bName"), email: $("#bEmail"), service: $("#bService"),
        location: $("#bLocation"), date: $("#bDate"),
        attendees: $("#bAttendees"), message: $("#bMessage")
      };
      var ok = true, firstBad = null;
      ["name", "email", "location", "message"].forEach(function (k) {
        var el = fields[k];
        var bad = !el.value.trim() || (k === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value.trim()));
        el.classList.toggle("err", bad);
        if (bad) { ok = false; if (!firstBad) firstBad = el; }
      });
      if (!ok) { if (firstBad) firstBad.focus(); return; }
      var subject = "Booking Request — " + fields.service.value + " — " + fields.name.value.trim();
      var lines = [
        "Name / Organization: " + fields.name.value.trim(),
        "Email: " + fields.email.value.trim(),
        "Service Requested: " + fields.service.value,
        "City / Country: " + fields.location.value.trim(),
        "Estimated Date(s): " + (fields.date.value.trim() || "Flexible"),
        "Expected Audience: " + (fields.attendees.value.trim() || "Not specified"),
        "",
        "Project Details:",
        fields.message.value.trim()
      ];
      window.location.href = "mailto:bboyelninoboston@gmail.com?subject=" +
        encodeURIComponent(subject) + "&body=" + encodeURIComponent(lines.join("\n"));
    });
    ["bName", "bEmail", "bLocation", "bMessage"].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener("input", function () { el.classList.remove("err"); });
    });
  }

  /* ---------- Chat: Ask about El Ni\u00f1o (carried over from the previous site) ---------- */
  var BOOK_EMAIL = "bboyelninoboston@gmail.com";
  var STUDIO_EMAIL = "floorlordsboston@gmail.com";
  function mailLink(email) { return '<a href="mailto:' + email + '">' + email + '</a>'; }
  var ANSWERS = {
    greeting: 'Aloha, welcome. I can help with bookings, workshops, judging, speaking, and the Floorlords Studio. Tap a question below or type your own.',
    book: 'To book El Ni\u00f1o for workshops, judging, speaking, or an appearance, email ' + mailLink(BOOK_EMAIL) + '. That inbox goes straight to him. Let him know your date, city, and what you have in mind.',
    workshops: 'El Ni\u00f1o offers Breaking Workshops and Hip Hop History, plus classes through the Floorlords Studio. He has 28+ years of teaching behind him. For workshop bookings or class details, email ' + mailLink(BOOK_EMAIL) + ' \u2014 for the studio, you can also reach ' + mailLink(STUDIO_EMAIL) + '.',
    studio: 'Floorlords Studio is at 66 Winthrop Street, Cambridge, MA (Harvard Square). Studio email: ' + mailLink(STUDIO_EMAIL) + '. For bookings with El Ni\u00f1o himself, use ' + mailLink(BOOK_EMAIL) + '.',
    event: 'Next up: the Red Bull BC One World Final, Nov 27 to 29, 2026 in Toronto, Canada. Then the Kazakhstan Breaking Championships in Astana, Dec 4 to 6, where El Ni\u00f1o is judging, and the Ground Zero Crew 30 Year Anniversary on Dec 12 in Miami, where he is judging alongside Crumbs and Moy.',
    who: 'Alex Diaz is B-Boy El Ni\u00f1o \u2014 world champion breaker from Boston, president of the Floorlords Crew (Boston, since 1981). He won his first world title at age 11, has performed in 35+ countries, and has 28+ years of teaching.',
    services: 'El Ni\u00f1o can be booked for four things: Breaking Workshops, Hip Hop History, Event Judging, and Keynote & Speaking. To book any of them, email ' + mailLink(BOOK_EMAIL) + '.',
    judge: 'For Event Judging, El Ni\u00f1o brings three decades at the top of the battle scene. To book him as a judge, email ' + mailLink(BOOK_EMAIL) + ' with your event date and city.',
    speak: 'For Keynote & Speaking, El Ni\u00f1o shares a story that starts with a world title at age 11 and leads the Floorlords Crew today. To book him to speak, email ' + mailLink(BOOK_EMAIL) + '.',
    history: 'Hip Hop History is one of his booking services \u2014 the real story of the culture, told by somebody who lived it. To book it, email ' + mailLink(BOOK_EMAIL) + '.',
    contact: 'All booking and general inquiries go to ' + mailLink(BOOK_EMAIL) + '. For the Floorlords Studio specifically, email ' + mailLink(STUDIO_EMAIL) + '.',
    social: 'You can find El Ni\u00f1o on Instagram at @bboyelnino \u2014 there are also links to TikTok, YouTube, Facebook, X, and Threads in the footer of this page. For bookings, email ' + mailLink(BOOK_EMAIL) + '.',
    price: 'I cannot quote prices here \u2014 every booking is different. For rates and availability, email ' + mailLink(BOOK_EMAIL) + ' with your date, city, and what you need, and he will get back to you.',
    fallback: 'I do not have that answer here, and I do not want to guess. For anything I cannot cover, email ' + mailLink(BOOK_EMAIL) + ' and he will help you direct.'
  };
  var chatContainer = $(".chat-widget-container");
  var chatToggle = $("#chatToggle"), chatPanel = $("#chatPanel"),
      chatCloseBtn = $("#chatClose"), chatMessages = $("#chatMessages"),
      chatForm = $("#chatForm"), chatInput = $("#chatInput"),
      chatQuick = $("#chatQuick");
  var greeted = false;
  function addMsg(text, who) {
    var div = document.createElement("div");
    div.className = "msg " + who;
    if (who === "bot") { div.innerHTML = text; } else { div.textContent = text; }
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return div;
  }
  function answerFor(raw) {
    var t = (raw || "").toLowerCase();
    if (/\b(price|cost|fee|fees|rate|rates|how much|charge|pricing)\b/.test(t)) return ANSWERS.price;
    if (t.indexOf("studio") !== -1 || t.indexOf("where") !== -1 || t.indexOf("location") !== -1 || t.indexOf("address") !== -1 || t.indexOf("cambridge") !== -1 || t.indexOf("harvard") !== -1) return ANSWERS.studio;
    if (t.indexOf("workshop") !== -1 || t.indexOf("class") !== -1 || t.indexOf("teach") !== -1 || t.indexOf("lesson") !== -1 || t.indexOf("train") !== -1) return ANSWERS.workshops;
    if (t.indexOf("judge") !== -1 || t.indexOf("judging") !== -1) return ANSWERS.judge;
    if (t.indexOf("speak") !== -1 || t.indexOf("keynote") !== -1 || t.indexOf("talk") !== -1) return ANSWERS.speak;
    if (t.indexOf("history") !== -1) return ANSWERS.history;
    if (t.indexOf("event") !== -1 || t.indexOf("next") !== -1 || t.indexOf("miami") !== -1 || t.indexOf("december") !== -1 || t.indexOf("ground zero") !== -1 || t.indexOf("show") !== -1) return ANSWERS.event;
    if (t.indexOf("instagram") !== -1 || t.indexOf("social") !== -1 || t.indexOf("tiktok") !== -1 || t.indexOf("youtube") !== -1 || t.indexOf("facebook") !== -1 || t.indexOf("threads") !== -1) return ANSWERS.social;
    if (t.indexOf("contact") !== -1 || t.indexOf("email") !== -1 || t.indexOf("reach") !== -1 || t.indexOf("phone") !== -1) return ANSWERS.contact;
    if (t.indexOf("book") !== -1 || t.indexOf("hire") !== -1 || t.indexOf("booking") !== -1) return ANSWERS.book;
    if (t.indexOf("who") !== -1 || t.indexOf("alex") !== -1 || t.indexOf("diaz") !== -1 || t.indexOf("champion") !== -1 || t.indexOf("elnino") !== -1 || t.indexOf("el nino") !== -1 || t.indexOf("el ni\u00f1o") !== -1) return ANSWERS.who;
    if (t.indexOf("service") !== -1 || t.indexOf("offer") !== -1 || t.indexOf("do you do") !== -1) return ANSWERS.services;
    return ANSWERS.fallback;
  }
  function setChat(open) {
    if (!chatPanel) return;
    chatPanel.classList.toggle("open", open);
    if (chatContainer) chatContainer.classList.toggle("open", open);
    if (chatToggle) {
      chatToggle.setAttribute("aria-expanded", open ? "true" : "false");
      chatToggle.setAttribute("aria-label", open ? "Close chat: Ask about El Ni\u00f1o" : "Open chat: Ask about El Ni\u00f1o");
    }
    chatPanel.setAttribute("aria-hidden", open ? "false" : "true");
    if (open && !greeted) { greeted = true; addMsg(ANSWERS.greeting, "bot"); }
    if (open && chatInput) setTimeout(function () { try { chatInput.focus({ preventScroll: true }); } catch (e) { chatInput.focus(); } }, 60);
  }
  if (chatToggle) chatToggle.addEventListener("click", function () { setChat(!chatPanel.classList.contains("open")); });
  if (chatCloseBtn) chatCloseBtn.addEventListener("click", function () { setChat(false); if (chatToggle) chatToggle.focus(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && chatPanel && chatPanel.classList.contains("open")) setChat(false); });
  var heroChatBtn = $("#openChatQuick");
  if (heroChatBtn) heroChatBtn.addEventListener("click", function () { setChat(true); });
  if (chatQuick) chatQuick.addEventListener("click", function (e) {
    var btn = e.target.closest ? e.target.closest("button[data-q]") : null;
    if (!btn) return;
    addMsg(btn.textContent.trim(), "user");
    var map = { book: ANSWERS.book, workshops: ANSWERS.workshops, studio: ANSWERS.studio, event: ANSWERS.event, who: ANSWERS.who };
    var ans = map[btn.getAttribute("data-q")] || ANSWERS.fallback;
    setTimeout(function () { addMsg(ans, "bot"); }, 180);
  });
  if (chatForm) chatForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var val = chatInput.value.trim();
    if (!val) return;
    addMsg(val, "user");
    chatInput.value = "";
    var ans = answerFor(val);
    setTimeout(function () { addMsg(ans, "bot"); }, 180);
  });
})();
