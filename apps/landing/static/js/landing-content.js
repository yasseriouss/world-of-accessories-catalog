/**
 * Landing content binding.
 * Loads editable content (managed from the dashboard) and applies it to the page:
 *   data-cms="hero_title"        -> textContent  (uses hero_title_ar / hero_title_en by language)
 *   data-cms-href="tel:{phone}"  -> href template
 *   data-cms-src="hero_image"    -> img src
 *   data-cms-bg="hero_image"     -> background-image
 * Keys come from the "landing" and "site" rows of woa_settings.
 */
(function () {
    "use strict";
    var SUPABASE_URL = "https://jzllhisbgjfdnurfuzfb.supabase.co";
    var ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6bGxoaXNiZ2pmZG51cmZ1emZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM5NTI5MDksImV4cCI6MjA5OTUyODkwOX0.0iIEyyD9pI8eblIixI8nbHJMm05kngTIMEWAi7yg_Eg";

    function lang() {
        return document.documentElement.lang === "en" ? "en" : "ar";
    }

    function pick(data, key) {
        var v = data[key + "_" + lang()];
        if (v === undefined || v === "") v = data[key + "_ar"];
        if (v === undefined || v === "") v = data[key];
        return v;
    }

    function safeUrl(v) {
        return /^(https:\/\/|tel:|mailto:|\/|#)/i.test(v) ? v : "";
    }

    function apply(data) {
        document.querySelectorAll("[data-cms]").forEach(function (el) {
            var v = pick(data, el.getAttribute("data-cms"));
            if (v !== undefined && v !== "") el.textContent = v;
        });
        document.querySelectorAll("[data-cms-href]").forEach(function (el) {
            var tpl = el.getAttribute("data-cms-href");
            var out = tpl.replace(/\{(\w+)\}/g, function (_, k) {
                var v = pick(data, k);
                return v === undefined ? "" : encodeURIComponent(v).replace(/%3A/gi, ":").replace(/%2F/gi, "/");
            });
            var ok = safeUrl(out);
            if (ok) el.setAttribute("href", ok);
        });
        document.querySelectorAll("[data-cms-src]").forEach(function (el) {
            var v = safeUrl(String(pick(data, el.getAttribute("data-cms-src")) || ""));
            if (v) el.setAttribute("src", v);
        });
        document.querySelectorAll("[data-cms-bg]").forEach(function (el) {
            var v = safeUrl(String(pick(data, el.getAttribute("data-cms-bg")) || ""));
            if (v) el.style.backgroundImage = "url('" + v.replace(/'/g, "%27") + "')";
        });
    }

    function load() {
        fetch(SUPABASE_URL + "/rest/v1/woa_settings?select=key,value&key=in.(landing,site)", {
            headers: { apikey: ANON_KEY, Authorization: "Bearer " + ANON_KEY }
        })
            .then(function (r) { return r.ok ? r.json() : []; })
            .then(function (rows) {
                var data = {};
                rows.forEach(function (row) { Object.assign(data, row.value || {}); });
                window.WOA_CONTENT = data;
                apply(data);
                new MutationObserver(function () { apply(data); }).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
            })
            .catch(function () { /* keep the static content */ });
    }

    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", load);
    else load();
})();
