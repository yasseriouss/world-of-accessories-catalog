/**
 * Landing page behaviour: language toggle and announcement bar.
 * Content text itself is bound by landing-content.js (data-cms attributes).
 */
(function () {
    "use strict";
    var SUPABASE_URL = "https://jzllhisbgjfdnurfuzfb.supabase.co";
    var ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6bGxoaXNiZ2pmZG51cmZ1emZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM5NTI5MDksImV4cCI6MjA5OTUyODkwOX0.0iIEyyD9pI8eblIixI8nbHJMm05kngTIMEWAi7yg_Eg";

    var banners = [];
    var active = 0;
    var timer = null;

    function currentLang() {
        var saved = null;
        try { saved = localStorage.getItem("woa_lang"); } catch (e) {}
        return saved === "en" ? "en" : "ar";
    }

    function applyLang(lang) {
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
        try { localStorage.setItem("woa_lang", lang); } catch (e) {}
        var btn = document.getElementById("langToggleBtn");
        if (btn) btn.textContent = lang === "ar" ? "🌐 English" : "🌐 العربية";
        renderBanners();
    }

    window.toggleLanguage = function () {
        applyLang(currentLang() === "ar" ? "en" : "ar");
    };

    function safeLink(url) {
        return /^(https?:\/\/|tel:|#|\/)/i.test(url || "") ? url : "#";
    }

    function renderBanners() {
        var bar = document.getElementById("woaTopBar");
        var box = document.getElementById("woaTopBarContent");
        if (!bar || !box) return;
        if (!banners.length) {
            bar.style.display = "none";
            return;
        }
        bar.style.display = "flex";
        var ar = currentLang() === "ar";
        box.textContent = "";
        banners.forEach(function (b, i) {
            var a = document.createElement("a");
            a.className = "woa-tb-item" + (i === active ? " active" : "");
            a.href = safeLink(b.link);
            if (/^https?:/i.test(a.href) && a.hostname !== location.hostname) {
                a.target = "_blank";
                a.rel = "noopener";
            }
            var badge = document.createElement("span");
            badge.className = "woa-tb-badge";
            badge.textContent = (ar ? b.badge_ar || b.badge_en : b.badge_en || b.badge_ar) || "";
            var text = document.createElement("span");
            text.className = "woa-tb-text";
            text.textContent = (ar ? b.text_ar || b.text_en : b.text_en || b.text_ar) || "";
            a.appendChild(badge);
            a.appendChild(text);
            box.appendChild(a);
        });
        restartCycle();
    }

    function show(i) {
        var items = document.querySelectorAll(".woa-tb-item");
        if (!items.length) return;
        active = (i + items.length) % items.length;
        items.forEach(function (el, idx) { el.classList.toggle("active", idx === active); });
    }

    function restartCycle() {
        clearInterval(timer);
        if (banners.length > 1) timer = setInterval(function () { show(active + 1); }, 4500);
    }

    window.nextBanner = function () { show(active + 1); restartCycle(); };
    window.prevBanner = function () { show(active - 1); restartCycle(); };
    window.triggerPwaInstall = function () {};

    function loadBanners() {
        fetch(SUPABASE_URL + "/rest/v1/woa_banners?select=badge_ar,badge_en,text_ar,text_en,link&active=eq.true&order=sort_order.asc,id.asc", {
            headers: { apikey: ANON_KEY, Authorization: "Bearer " + ANON_KEY }
        })
            .then(function (r) { return r.ok ? r.json() : []; })
            .then(function (rows) { banners = rows || []; renderBanners(); })
            .catch(function () { renderBanners(); });
    }

    function init() {
        applyLang(currentLang());
        loadBanners();
    }

    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
    else init();
})();
