/**
 * World of Accessories - responsive side menu
 * Moves every header action (links, cart, language, logout...) into an
 * accessible slide-in drawer and leaves only brand + menu button in the header.
 */
(function () {
    "use strict";
    if (window.WOASideMenu) return;

    var COPY = {
        ar: { menu: "القائمة", open: "فتح القائمة", close: "إغلاق القائمة" },
        en: { menu: "Menu", open: "Open menu", close: "Close menu" }
    };

    var css = [
        ".sm-toggle{position:relative;display:inline-flex;align-items:center;justify-content:center;width:44px;height:44px;flex-shrink:0;margin-inline-start:auto;padding:0;border-radius:12px;border:1px solid rgba(255,255,255,.28);background:rgba(255,255,255,.14);color:#fff;cursor:pointer;transition:background .2s,transform .2s}",
        ".sm-toggle:hover{background:rgba(255,255,255,.24)}",
        ".sm-toggle:focus-visible,.sm-close:focus-visible{outline:3px solid #FF8C3D;outline-offset:2px}",
        ".sm-toggle svg,.sm-close svg{width:22px;height:22px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}",
        ".sm-badge{position:absolute;top:-6px;inset-inline-end:-6px;min-width:20px;height:20px;padding:0 5px;border-radius:10px;background:#FF8C3D;color:#fff;font-weight:800;font-size:11px;line-height:20px;font-family:inherit;text-align:center}",
        ".sm-overlay{position:fixed;inset:0;z-index:99990;background:rgba(15,23,42,.55);opacity:0;visibility:hidden;transition:opacity .25s,visibility .25s}",
        ".sm-overlay.sm-open{opacity:1;visibility:visible}",
        ".sm-drawer{position:fixed;top:0;bottom:0;inset-inline-start:0;z-index:99991;width:min(320px,86vw);display:flex;flex-direction:column;background:#fff;color:#0F172A;box-shadow:0 0 40px rgba(15,23,42,.35);visibility:hidden;transition:transform .28s cubic-bezier(.16,1,.3,1),visibility .28s}",
        "html[dir=rtl] .sm-drawer{transform:translateX(100%)}",
        "html:not([dir=rtl]) .sm-drawer{transform:translateX(-100%)}",
        ".sm-drawer.sm-open{transform:translateX(0)!important;visibility:visible}",
        ".sm-head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:16px 16px 14px;background:#1A3F7F;color:#fff;border-bottom:3px solid #FF8C3D}",
        ".sm-title{font-size:17px;font-weight:800;margin:0}",
        ".sm-close{display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;border-radius:10px;border:1px solid rgba(255,255,255,.3);background:rgba(255,255,255,.12);color:#fff;cursor:pointer}",
        ".sm-body{flex:1;overflow-y:auto;overscroll-behavior:contain;padding:14px;-webkit-overflow-scrolling:touch}",
        ".sm-drawer .sm-list{display:flex!important;flex-direction:column!important;flex-wrap:nowrap!important;align-items:stretch!important;justify-content:flex-start!important;gap:8px!important;width:100%!important;margin:0!important;padding:0!important;position:static!important}",
        ".sm-drawer .sm-list>a,.sm-drawer .sm-list>button{display:flex;align-items:center;justify-content:flex-start;gap:12px;width:100%;min-height:48px;margin:0;padding:12px 14px;border-radius:12px;font-weight:700;font-size:15px;line-height:1.3;font-family:inherit;text-align:start;text-decoration:none;cursor:pointer;box-shadow:none;transform:none}",
        ".sm-drawer .sm-list>a:not([style*=background]):not(.sm-primary),.sm-drawer .sm-list>button:not([style*=background]):not(.sm-primary){background:#F1F5F9!important;color:#1A3F7F!important;border:1px solid #E2E8F0!important}",
        ".sm-drawer .sm-list>a:not([style*=background]):hover,.sm-drawer .sm-list>button:not([style*=background]):hover{background:#E2E8F0!important}",
        ".sm-drawer .sm-list>.active,.sm-drawer .sm-list>[aria-current=page]{background:#1A3F7F!important;color:#fff!important;border-color:#1A3F7F!important}",
        ".sm-drawer .sm-list>*[style*=background]{color:#fff!important}",
        ".sm-drawer .sm-list>*:focus-visible{outline:3px solid #FF8C3D;outline-offset:2px}",
        ".sm-drawer .sm-list span{display:inline!important}",
        ".sm-drawer .sm-list .nav-cart-badge{margin-inline-start:auto}",
        ".sm-drawer .sm-list svg{flex-shrink:0}",
        "html.sm-lock,html.sm-lock body{overflow:hidden}",
        "@media (prefers-reduced-motion:reduce){.sm-drawer,.sm-overlay{transition:none}}"
    ].join("\n");

    function lang() {
        return document.documentElement.lang === "en" ? "en" : "ar";
    }

    function menuIcon(name) {
        var paths = name === "close"
            ? '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>'
            : '<line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="18" y2="18"/>';
        return '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + paths + "</svg>";
    }

    function init() {
        var header = document.querySelector("header.navbar, header.top-navbar, header.admin-navbar");
        if (!header) return;
        var actions = header.querySelector(".nav-actions, .admin-nav-actions");
        if (!actions) return;

        var style = document.createElement("style");
        style.textContent = css;
        document.head.appendChild(style);

        var toggle = document.createElement("button");
        toggle.type = "button";
        toggle.className = "sm-toggle";
        toggle.setAttribute("aria-haspopup", "dialog");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-controls", "siteSideMenu");
        toggle.innerHTML = menuIcon("menu") + '<span class="sm-badge" hidden></span>';
        header.appendChild(toggle);

        var overlay = document.createElement("div");
        overlay.className = "sm-overlay";

        var drawer = document.createElement("aside");
        drawer.id = "siteSideMenu";
        drawer.className = "sm-drawer";
        drawer.setAttribute("role", "dialog");
        drawer.setAttribute("aria-modal", "true");
        drawer.setAttribute("aria-hidden", "true");

        var head = document.createElement("div");
        head.className = "sm-head";
        var title = document.createElement("h2");
        title.className = "sm-title";
        var closeBtn = document.createElement("button");
        closeBtn.type = "button";
        closeBtn.className = "sm-close";
        closeBtn.innerHTML = menuIcon("close");
        head.appendChild(title);
        head.appendChild(closeBtn);

        var body = document.createElement("div");
        body.className = "sm-body";
        actions.classList.add("sm-list");
        body.appendChild(actions);

        drawer.appendChild(head);
        drawer.appendChild(body);
        document.body.appendChild(overlay);
        document.body.appendChild(drawer);

        function labels() {
            var c = COPY[lang()];
            title.textContent = c.menu;
            drawer.setAttribute("aria-label", c.menu);
            closeBtn.setAttribute("aria-label", c.close);
            toggle.setAttribute("aria-label", c.open);
        }

        function focusables() {
            return Array.prototype.filter.call(
                drawer.querySelectorAll("a[href],button:not([disabled])"),
                function (el) { return el.offsetParent !== null; }
            );
        }

        var isOpen = false;
        function setOpen(open) {
            if (open === isOpen) return;
            isOpen = open;
            labels();
            drawer.classList.toggle("sm-open", open);
            overlay.classList.toggle("sm-open", open);
            drawer.setAttribute("aria-hidden", open ? "false" : "true");
            toggle.setAttribute("aria-expanded", open ? "true" : "false");
            document.documentElement.classList.toggle("sm-lock", open);
            if (open) {
                var first = focusables()[0] || closeBtn;
                setTimeout(function () { first.focus(); }, 60);
            } else {
                toggle.focus();
            }
        }

        toggle.addEventListener("click", function () { setOpen(!isOpen); });
        closeBtn.addEventListener("click", function () { setOpen(false); });
        overlay.addEventListener("click", function () { setOpen(false); });

        // Run the item's own handler first, then close the drawer.
        actions.addEventListener("click", function (e) {
            if (e.target.closest("a[href],button")) setTimeout(function () { setOpen(false); }, 0);
        });

        document.addEventListener("keydown", function (e) {
            if (!isOpen) return;
            if (e.key === "Escape") {
                setOpen(false);
                return;
            }
            if (e.key !== "Tab") return;
            var items = focusables();
            if (!items.length) return;
            var firstEl = closeBtn, lastEl = items[items.length - 1];
            if (e.shiftKey && document.activeElement === firstEl) {
                e.preventDefault();
                lastEl.focus();
            } else if (!e.shiftKey && document.activeElement === lastEl) {
                e.preventDefault();
                firstEl.focus();
            }
        });

        // Mirror the cart count onto the menu button so it stays visible.
        var cartBadge = document.getElementById("woaHeaderCartBadge");
        if (cartBadge) {
            var badge = toggle.querySelector(".sm-badge");
            var sync = function () {
                var n = (cartBadge.textContent || "").trim();
                var show = n && n !== "0" && cartBadge.style.display !== "none";
                badge.hidden = !show;
                badge.textContent = show ? n : "";
            };
            sync();
            new MutationObserver(sync).observe(cartBadge, { childList: true, characterData: true, subtree: true, attributes: true });
        }

        new MutationObserver(labels).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
        labels();

        window.WOASideMenu = { open: function () { setOpen(true); }, close: function () { setOpen(false); } };
    }

    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
    else init();
})();
