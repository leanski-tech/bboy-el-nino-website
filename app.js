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

  /* ---------- Cypher Bot chat ---------- */
  var ANSWERS = {
    book: "To book El Niño for battles, judging, workshops, or appearances, email bboyelninoboston@gmail.com or use the booking form on this page. Serious inquiries get a direct reply from his team.",
    workshops: "El Niño teaches workshops and masterclasses worldwide, all levels: foundation, footwork, power moves, freezes, and battle strategy. He also runs classes at Floorlords Studio in Cambridge, MA. Email bboyelninoboston@gmail.com to set one up.",
    studio: "Floorlords Studio is at 66 Winthrop Street, Cambridge, MA (Harvard Square). It is the crew's home base for classes, training, and cyphers. Email floorlordsboston@gmail.com for class info.",
    event: "Next up: Nov 27 to 29, 2026, Red Bull BC One World Final in Toronto, Canada, where he battles with the crew. Then Dec 4 to 6 he judges the Kazakhstan Breaking Championships in Astana, and Dec 12 he judges the Ground Zero Crew 30 Year Anniversary in Miami.",
    who: "Alex Diaz, B-Boy El Niño, is a world champion breaker from Boston. He won Red Bull Lords of the Floor at 11 years old, is a Red Bull BC One Ambassador, and is President of Floorlords Crew, founded in Boston in 1981 by his uncles, Lino Leanski Delgado and Noz."
  };
  var FALLBACK = "Good question. For anything specific, email bboyelninoboston@gmail.com for bookings, or floorlordsboston@gmail.com for the studio. Or tap one of the quick questions below.";
  var chatContainer = $(".chat-widget-container");
  var chatToggle = $("#chatToggle"), chatPanel = $("#chatPanel"),
      chatClose = $("#chatClose"), chatMessages = $("#chatMessages"),
      chatForm = $("#chatForm"), chatInput = $("#chatInput"),
      chatQuick = $("#chatQuick"), chatCallout = $("#chatCallout");
  var chatOpened = false;

  function addMsg(text, who) {
    var div = document.createElement("div");
    div.className = "msg " + who;
    div.textContent = text;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  function botReply(text) { setTimeout(function () { addMsg(text, "bot"); }, 320); }
  function setChat(open) {
    if (!chatPanel) return;
    chatPanel.classList.toggle("open", open);
    chatPanel.setAttribute("aria-hidden", open ? "false" : "true");
    if (chatToggle) chatToggle.setAttribute("aria-expanded", open ? "true" : "false");
    if (chatContainer) chatContainer.classList.toggle("open", open);
    if (chatCallout) chatCallout.classList.toggle("gone", open);
    if (open && !chatOpened) {
      chatOpened = true;
      botReply("Peace. Ask me about bookings, workshops, the studio, or where El Niño is battling next.");
    }
    if (open && chatInput) setTimeout(function () { chatInput.focus(); }, 250);
  }
  if (chatToggle) chatToggle.addEventListener("click", function () {
    setChat(!chatPanel.classList.contains("open"));
  });
  if (chatClose) chatClose.addEventListener("click", function () { setChat(false); });
  var heroChatBtn = $("#openChatQuick");
  if (heroChatBtn) heroChatBtn.addEventListener("click", function () { setChat(true); });
  if (chatQuick) $$("button", chatQuick).forEach(function (btn) {
    btn.addEventListener("click", function () {
      var key = btn.getAttribute("data-q");
      addMsg(btn.textContent.trim(), "user");
      botReply(ANSWERS[key] || FALLBACK);
    });
  });
  function answerFor(text) {
    var t = text.toLowerCase();
    if (/(book|hire|cost|price|fee|rate)/.test(t)) return ANSWERS.book;
    if (/(workshop|class|teach|masterclass|lesson|train)/.test(t)) return ANSWERS.workshops;
    if (/(studio|cambridge|winthrop|where.*(studio|class))/.test(t)) return ANSWERS.studio;
    if (/(next|event|battle|toronto|astana|kazakhstan|miami|show|tour|when)/.test(t)) return ANSWERS.event;
    if (/(who|about|alex|history|bio)/.test(t)) return ANSWERS.who;
    if (/(judge|judging)/.test(t)) return "El Niño judges battles from local jams to world finals. For judging bookings, email bboyelninoboston@gmail.com with your event date and city.";
    if (/(speak|keynote|school|lecture)/.test(t)) return "El Niño speaks at schools, universities, and events on hip hop history and his 30 years in the culture. Email bboyelninoboston@gmail.com to book a talk.";
    if (/(instagram|tiktok|youtube|social|follow)/.test(t)) return "Follow him at @bboyelnino on Instagram and TikTok, and on YouTube as Alex Diaz (Bboy El Niño). Links are at the bottom of this page.";
    if (/(email|contact|reach)/.test(t)) return "Bookings: bboyelninoboston@gmail.com. Studio: floorlordsboston@gmail.com.";
    return FALLBACK;
  }
  if (chatForm) chatForm.addEventListener("submit", function (ev) {
    ev.preventDefault();
    var text = chatInput.value.trim();
    if (!text) return;
    addMsg(text, "user");
    chatInput.value = "";
    botReply(answerFor(text));
  });
})();
