/**
 * World of Accessories - Customer Web Catalog Interactivity
 * High performance, smooth animations, bilingual support, live search & filtering
 * Multi-dimensional filtering: Category + Usage Type (مطابخ، دريسنج، أخرى)
 */

let allProducts = [];
let categoriesList = [];
let usageTypesList = [];
let activeCategoryId = 0; // 0 = all
let activeUsageType = "all"; // 'all', 'kitchen', 'dressing', 'other'
let searchQuery = "";
let currentSort = "id_asc";
let currentLang = localStorage.getItem("woa_lang") || "ar";

const i18n = {
    ar: {
        brandTitle: "عالم الاكسسوار",
        brandSub: "World of Accessories • الكتالوج الرسمي 2026",
        heroPill: "✨ تشكيلة ٢٠٢٦ الفاخرة • Official 2026 Collection",
        heroTitle: "عالم من إكسسوارات الأثاث والمطابخ الفاخرة",
        heroSub: "تصفح تشكيلة متكاملة تضم أكثر من ٥٩٠ منتجاً عالي الجودة من مفصلات، مقابض، وسكك حركة.",
        searchPlaceholder: "ابحث باسم المنتج، الكود أو الفئة (مثال: مفصلة سوفت كلوز، مقبض ذهبي)...",
        allCategories: "🌟 كافة الفئات",
        allSpaces: "🌟 كافة الاستخدامات",
        kitchenSpace: "🍳 مطابخ",
        dressingSpace: "👔 دريسينج",
        otherSpace: "🛋️ أخرى وعام",
        itemsShowing: "عرض",
        ofProducts: "منتجاً",
        inCategory: "في",
        quickView: "معاينة سريعة",
        addToCart: "إضافة للسلة 🛒",
        whatsappOrder: "استفسار واتساب",
        currency: "ج.م",
        emptyTitle: "لم يتم العثور على منتجات مطابقة",
        emptySub: "جرب البحث بكلمات أخرى أو اختر فئة مختلفة.",
        copyCode: "نسخ الكود",
        copiedToast: "تم نسخ كود المنتج إلى الحافظة!",
        langBtn: "🌐 English",
        adminBtn: "⚙️ الإدارة",
        printedBtn: "📖 الكتالوجات المطبوعة",
        officialPrices: "أسعار رسمية معتمدة",
        specializedCategories: "فئات متخصصة",
        certifiedItems: "منتج معتمد",
        spaceLabel: "نطاق الاستخدام:",
        contactTitle: "تواصل معنا وشرفنا بالزيارة",
        contactSub: "يسعدنا استقبالكم في معرضنا للتعرف على تشكيلة إكسسوارات الأثاث والمطابخ الفاخرة، أو التواصل الفوري عبر الهاتف والواتساب للطلبات والاستفسارات.",
        locTitle: "فرع ومعرض مدينة 6 أكتوبر",
        locDesc: "المحور المركزي – بجوار ميدان النجدة – داخل سيلا مول",
        phoneTitle: "رقم التواصل والاتصال المباشر",
        waTitle: "محادثة واتساب الفورية",
        socialTitle: "منصات التواصل الاجتماعي الرسمية",
        navAbout: "من نحن",
        navInstall: "تثبيت التطبيق"
    },
    en: {
        brandTitle: "accessories World",
        brandSub: "Official 2026 Digital Catalog",
        heroPill: "✨ Official 2026 Collection • High Quality Hardware",
        heroTitle: "Premium Furniture & Kitchen Hardware Fittings",
        heroSub: "Explore an executive collection of over 590 certified hardware fittings: soft-close hinges, modern handles, and precision drawer systems.",
        searchPlaceholder: "Search by product name, SKU or category (e.g. Soft Close Hinge, Handle, Slide)...",
        allCategories: "🌟 All Categories",
        allSpaces: "🌟 All Applications",
        kitchenSpace: "🍳 Kitchens",
        dressingSpace: "👔 Dressing",
        otherSpace: "🛋️ General / Other",
        itemsShowing: "Showing",
        ofProducts: "products",
        inCategory: "in",
        quickView: "Quick View",
        addToCart: "Add to Cart 🛒",
        whatsappOrder: "WhatsApp Inquiry",
        currency: "EGP",
        emptyTitle: "No products matched your search",
        emptySub: "Try using different keywords or select another category.",
        copyCode: "Copy SKU Code",
        copiedToast: "Product SKU copied to clipboard!",
        langBtn: "🌐 العربية",
        adminBtn: "⚙️ Admin",
        printedBtn: "📖 Printed Catalogs",
        officialPrices: "Official Certified Prices",
        specializedCategories: "Specialized Categories",
        certifiedItems: "Certified Products",
        spaceLabel: "Application Domain:",
        contactTitle: "Contact Us & Visit Our Showroom",
        contactSub: "We are pleased to welcome you to our showroom or assist you directly via phone and WhatsApp for orders and inquiries.",
        locTitle: "6th of October City Branch & Showroom",
        locDesc: "Central Axis – next to Al-Nagda Sq. – inside Silla Mall",
        phoneTitle: "Direct Phone & Customer Support",
        waTitle: "Instant WhatsApp Chat",
        socialTitle: "Official Social Media Channels",
        navAbout: "About Us",
        navInstall: "Install App"
    }
};

// ----------------- Brand Preloader Dismissal -----------------
let preloaderDismissed = false;
function dismissPreloader() {
    if (preloaderDismissed) return;
    preloaderDismissed = true;
    if (typeof window.__woaDismissPreloader === "function") {
        window.__woaDismissPreloader();
        return;
    }
    const preloader = document.getElementById("woaPreloader");
    if (!preloader) return;
    preloader.classList.add("fade-out");
    setTimeout(() => {
        try { preloader.style.display = "none"; } catch (e) {}
    }, 650);
}

// ----------------- URL Deep-Linking & Parameter Routing -----------------
function parseUrlParameters() {
    try {
        const params = new URLSearchParams(window.location.search);

        // 1. Space / Usage type filter (?space=kitchen, ?space=dressing, ?space=other)
        const spaceParam = params.get("space") || params.get("usage");
        if (spaceParam && ["kitchen", "dressing", "other", "all"].includes(spaceParam.toLowerCase())) {
            activeUsageType = spaceParam.toLowerCase();
        }

        // 2. Category ID filter (?cat=1, ?category=1)
        const catParam = params.get("cat") || params.get("category");
        if (catParam) {
            const parsedCat = parseInt(catParam, 10);
            if (!isNaN(parsedCat) && parsedCat >= 0) {
                activeCategoryId = parsedCat;
            }
        }

        // 3. Search query (?q=مفصلة, ?search=...)
        const queryParam = params.get("q") || params.get("search");
        if (queryParam) {
            searchQuery = queryParam.trim();
            const searchInput = document.getElementById("mainSearch");
            if (searchInput) searchInput.value = searchQuery;
        }

        // 4. Cart auto-open modal (?open=cart)
        const openParam = params.get("open");
        if (openParam === "cart") {
            setTimeout(() => {
                if (window.WOACart && typeof window.WOACart.open === "function") {
                    window.WOACart.open();
                }
            }, 600);
        }
    } catch (e) {
        console.warn("Could not parse URL search parameters:", e);
    }
}

function updateUrlParams() {
    try {
        if (!window.location.pathname.includes("market") && !document.getElementById("productsGrid")) {
            return; // Only sync query params on market page
        }
        const url = new URL(window.location.href);
        if (activeUsageType && activeUsageType !== "all") {
            url.searchParams.set("space", activeUsageType);
        } else {
            url.searchParams.delete("space");
        }
        if (activeCategoryId && activeCategoryId > 0) {
            url.searchParams.set("cat", activeCategoryId);
        } else {
            url.searchParams.delete("cat");
        }
        if (searchQuery) {
            url.searchParams.set("q", searchQuery);
        } else {
            url.searchParams.delete("q");
        }
        window.history.replaceState({}, "", url.toString());
    } catch (e) {}
}

// Resilient Initialization (Handles Cached / Instant Ready States)
function initCatalogApp() {
    parseUrlParameters();
    applyLanguage(currentLang);
    fetchBanners();
    fetchUsageTypes();
    fetchCategories();
    fetchProducts().then(() => {
        setTimeout(dismissPreloader, 250);
    }).catch(() => {
        dismissPreloader();
    });
    setupSearchInput();
    // Safety fallback
    setTimeout(dismissPreloader, 1800);
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCatalogApp);
} else {
    initCatalogApp();
}

window.addEventListener("load", () => {
    setTimeout(dismissPreloader, 200);
});

// ----------------- Top Announcement Banner System -----------------
let bannersList = [];
let activeBannerIdx = 0;
let bannerCycleTimer = null;

async function fetchBanners() {
    // 1. Try local custom banners from Admin Dashboard
    try {
        const stored = localStorage.getItem("woa_banners_v1");
        if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) {
                bannersList = parsed.filter(b => b.active !== false);
                renderBanners();
                return;
            }
        }
    } catch (e) {}

    // 2. Fetch default banners from data/banners.json
    try {
        const res = await fetch("/data/banners.json");
        if (res.ok) {
            const data = await res.json();
            bannersList = (data || []).filter(b => b.active !== false);
            renderBanners();
            return;
        }
    } catch (e) {}

    // 3. Fallback standard banners
    bannersList = [
        {
            badge_ar: "🚚 شحن فوري",
            badge_en: "Fast Delivery",
            text_ar: "توصيل وشحن متاح لكافة محافظات مصر • الدفع عند الاستلام بعد المعاينة",
            text_en: "Nationwide shipping across all Egypt • Cash on Delivery with inspection",
            link: "#contact"
        },
        {
            badge_ar: "🛡️ ضمان معتمد",
            badge_en: "Official Warranty",
            text_ar: "ضمان استبدال معتمد على كافة مفصلات الساميت الهيدروليك وسكك الأدراج",
            text_en: "Replacement warranty on all Summit hydraulic hinges & heavy duty drawer slides",
            link: "https://wa.me/201140030036"
        }
    ];
    renderBanners();
}

function renderBanners() {
    const container = document.getElementById("woaTopBarContent");
    const topBar = document.getElementById("woaTopBar");
    if (!container || !topBar) return;

    if (!bannersList || bannersList.length === 0) {
        topBar.style.display = "none";
        return;
    }
    topBar.style.display = "flex";

    const isAr = (currentLang === "ar");
    let html = "";
    bannersList.forEach((b, idx) => {
        const badge = isAr ? (b.badge_ar || b.badge_en || 'إعلان') : (b.badge_en || b.badge_ar || 'News');
        const text = isAr ? (b.text_ar || b.text_en) : (b.text_en || b.text_ar);
        const link = b.link || "javascript:void(0)";
        const target = (link && (link.startsWith("http") || link.startsWith("https"))) ? 'target="_blank" rel="noopener"' : '';
        const activeClass = (idx === activeBannerIdx) ? "active" : "";

        html += `
            <a href="${link}" ${target} class="woa-tb-item ${activeClass}" data-banner-idx="${idx}">
                <span class="woa-tb-badge">${escapeHtmlBanner(badge)}</span>
                <span class="woa-tb-text">${escapeHtmlBanner(text)}</span>
            </a>
        `;
    });

    container.innerHTML = html;
    startBannerCycle();

    topBar.onmouseenter = () => clearInterval(bannerCycleTimer);
    topBar.onmouseleave = () => startBannerCycle();
}

function escapeHtmlBanner(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function showBanner(index) {
    if (!bannersList || bannersList.length === 0) return;
    const items = document.querySelectorAll(".woa-tb-item");
    if (!items || items.length === 0) return;

    activeBannerIdx = (index + items.length) % items.length;
    items.forEach((item, idx) => {
        if (idx === activeBannerIdx) {
            item.classList.add("active");
        } else {
            item.classList.remove("active");
        }
    });
}

function nextBanner() {
    showBanner(activeBannerIdx + 1);
    restartBannerCycle();
}

function prevBanner() {
    showBanner(activeBannerIdx - 1);
    restartBannerCycle();
}

function startBannerCycle() {
    clearInterval(bannerCycleTimer);
    if (!bannersList || bannersList.length <= 1) return;
    bannerCycleTimer = setInterval(() => {
        showBanner(activeBannerIdx + 1);
    }, 4500);
}

function restartBannerCycle() {
    clearInterval(bannerCycleTimer);
    startBannerCycle();
}

// ----------------- Language Management -----------------
function toggleLanguage() {
    currentLang = (currentLang === "ar") ? "en" : "ar";
    localStorage.setItem("woa_lang", currentLang);
    applyLanguage(currentLang);
    renderBanners();
    renderUsageFilterBar();
    renderCategories();
    renderProducts();
}

function applyLanguage(lang) {
    document.documentElement.lang = lang;
    document.documentElement.dir = (lang === "ar") ? "rtl" : "ltr";
    const t = i18n[lang];

    const setTxt = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
    };
    const setAttr = (id, attr, val) => {
        const el = document.getElementById(id);
        if (el) el.setAttribute(attr, val);
    };

    setTxt("navBrandTitle", t.brandTitle);
    setTxt("navBrandSub", t.brandSub);
    setTxt("langToggleBtn", t.langBtn);
    setTxt("navAdminBtn", t.adminBtn);
    setTxt("navPrintedBtn", t.printedBtn);
    setTxt("navAboutText", t.navAbout);
    setTxt("navInstallText", t.navInstall);
    setTxt("fnLinkAbout", (lang === "ar") ? "عن عالم الاكسسوار والمعرض" : "About Us & Showroom");
    setTxt("modalQtyLabel", (lang === "ar") ? "الكمية المطلوبة:" : "Quantity:");

    // Dynamic PWA Manifest and Apple App Title localization for phone home screen
    if (lang === "en") {
        setAttr("pwaManifestLink", "href", "/manifest_en.json");
        setAttr("appleAppTitle", "content", "accessories World");
        document.title = "accessories World | Official Digital Catalog 2026";
    } else {
        setAttr("pwaManifestLink", "href", "/manifest.json");
        setAttr("appleAppTitle", "content", "عالم الاكسسوار");
        document.title = "عالم الاكسسوار | الكتالوج الرقمي الرسمي 2026";
    }

    setTxt("heroPill", t.heroPill);
    setTxt("heroTitle", t.heroTitle);
    setTxt("heroSub", t.heroSub);
    setAttr("mainSearch", "placeholder", t.searchPlaceholder);

    setTxt("metricLabel1", t.certifiedItems);
    setTxt("metricLabel2", t.specializedCategories);
    setTxt("metricLabel3", t.officialPrices);

    setTxt("contactTitle", t.contactTitle);
    setTxt("contactSub", t.contactSub);
    setTxt("locTitle", t.locTitle);
    setTxt("locDesc", t.locDesc);
    setTxt("phoneTitle", t.phoneTitle);
    setTxt("waTitle", t.waTitle);
    setTxt("socialTitle", t.socialTitle);
}

// ----------------- API Data Fetching -----------------
// ----------------- Supabase Live Data Fetching with Resilient Fallback -----------------
let cachedRawProducts = null;

async function getRawProductsData(forceRefresh = false) {
    if (cachedRawProducts && !forceRefresh) return cachedRawProducts;

    // Check SessionStorage for instant 0ms reload
    if (!forceRefresh) {
        try {
            const stored = sessionStorage.getItem("woa_products_cache");
            if (stored) {
                cachedRawProducts = JSON.parse(stored);
                if (cachedRawProducts && cachedRawProducts.length > 0) {
                    return cachedRawProducts;
                }
            }
        } catch (e) {}
    }
    
    // 1. Try Supabase Live Database (if online)
    if (window.SupabaseSync) {
        try {
            const data = await window.SupabaseSync.fetchProducts();
            if (data && data.length > 0) {
                cachedRawProducts = data;
                try { sessionStorage.setItem("woa_products_cache", JSON.stringify(data)); } catch (e) {}
                return cachedRawProducts;
            }
        } catch (e) {
            console.warn("Supabase fetch failed, falling back:", e);
        }
    }

    // 2. Fallback to static JSON with CDN caching
    try {
        const res = await fetch("/data/products.json");
        if (res.ok) {
            cachedRawProducts = await res.json();
            try { sessionStorage.setItem("woa_products_cache", JSON.stringify(cachedRawProducts)); } catch (e) {}
            return cachedRawProducts;
        }
    } catch (e) {
        console.warn("Could not load /data/products.json:", e);
    }
    return [];
}

async function fetchUsageTypes() {
    // Calculate from live products
    const prods = await getRawProductsData();
    let kitchenCount = 0, dressingCount = 0, otherCount = 0;
    prods.forEach(p => {
        const u = p.usage_type || "other";
        if (u === "kitchen") kitchenCount++;
        else if (u === "dressing") dressingCount++;
        else otherCount++;
    });
    usageTypesList = [
        { key: "kitchen", ar: "مطابخ", en: "Kitchens", count: kitchenCount },
        { key: "dressing", ar: "دريسينج", en: "Dressing", count: dressingCount },
        { key: "other", ar: "أخرى وعام", en: "General / Other", count: otherCount }
    ];
    renderUsageFilterBar();
}

async function fetchCategories() {
    // 1. Try Supabase Live Categories
    if (window.SupabaseSync) {
        try {
            const data = await window.SupabaseSync.fetchCategories();
            if (data && data.length > 0) {
                categoriesList = data;
                renderCategories();
                return;
            }
        } catch (e) {}
    }

    // 2. Fallback to static JSON
    try {
        const res = await fetch("/data/categories_data.json");
        if (res.ok) {
            const data = await res.json();
            categoriesList = data.categories || [];
            renderCategories();
        }
    } catch (err) {
        console.error("Failed to load categories:", err);
    }
}

async function fetchProducts() {
    // If we already have products in-memory, perform instant 0ms client-side filtering (eliminates unnecessary 404 API calls on static CDN)
    if (cachedRawProducts && cachedRawProducts.length > 0) {
        filterAndRenderLocal(cachedRawProducts);
        return;
    }

    // Only query backend API if running on local dev server (port 8080)
    const isLocalApiServer = (window.location.port === "8080");
    if (isLocalApiServer) {
        try {
            let url = `/api/products?limit=600&sort=${currentSort}`;
        if (activeCategoryId > 0) url += `&category_id=${activeCategoryId}`;
        if (activeUsageType && activeUsageType !== "all") url += `&usage_type=${activeUsageType}`;
        if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;

        const res = await fetch(url);
        if (res.ok) {
            const data = await res.json();
            allProducts = data.products || [];
            renderProducts();
            return;
        }
        } catch (err) {
            // Fallback to client-side filtering
        }
    }

    const raw = await getRawProductsData();
    filterAndRenderLocal(raw);
}

function filterAndRenderLocal(raw) {
    let filtered = [...raw];

    if (activeCategoryId > 0) {
        filtered = filtered.filter(p => p.category_id === activeCategoryId);
    }
    if (activeUsageType && activeUsageType !== "all") {
        filtered = filtered.filter(p => (p.usage_type || "other") === activeUsageType);
    }
    if (searchQuery) {
        const q = searchQuery.toLowerCase().trim();
        filtered = filtered.filter(p => {
            const arMatch = p.ar && p.ar.toLowerCase().includes(q);
            const enMatch = p.en && p.en.toLowerCase().includes(q);
            const idMatch = p.id && String(p.id).includes(q);
            return arMatch || enMatch || idMatch;
        });
    }

    if (currentSort === "price_asc") {
        filtered.sort((a, b) => (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0));
    } else if (currentSort === "price_desc") {
        filtered.sort((a, b) => (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0));
    } else if (currentSort === "name_ar") {
        filtered.sort((a, b) => (a.ar || "").localeCompare(b.ar || "", "ar"));
    } else {
        filtered.sort((a, b) => (a.id || 0) - (b.id || 0));
    }

    allProducts = filtered;
    renderProducts();
}

// ----------------- Rendering -----------------
function renderUsageFilterBar() {
    const container = document.getElementById("spaceFilterBar");
    if (!container) return;

    const t = i18n[currentLang];
    const totalCount = usageTypesList.reduce((sum, u) => sum + (u.count || 0), 0);

    let html = `
        <button class="space-pill ${activeUsageType === 'all' ? 'active' : ''}" onclick="selectUsageType('all')">
            <span>${t.allSpaces}</span>
            <span class="space-count-badge">${totalCount || 591}</span>
        </button>
    `;

    usageTypesList.forEach(u => {
        const isActive = (activeUsageType === u.key);
        let name = (currentLang === "ar") ? u.ar : u.en;
        if (u.key === "kitchen") name = t.kitchenSpace;
        else if (u.key === "dressing") name = t.dressingSpace;
        else if (u.key === "other") name = t.otherSpace;

        html += `
            <button class="space-pill ${isActive ? 'active' : ''}" onclick="selectUsageType('${u.key}')">
                <span>${u.icon} ${name}</span>
                <span class="space-count-badge">${u.count || 0}</span>
            </button>
        `;
    });

    container.innerHTML = html;
}

function selectUsageType(typeKey) {
    activeUsageType = typeKey;
    renderUsageFilterBar();
    updateUrlParams();
    fetchProducts();
}

function renderCategories() {
    const container = document.getElementById("categoryScroll");
    if (!container) return;

    const t = i18n[currentLang];
    let totalCount = categoriesList.reduce((sum, c) => sum + (c.live_count || 0), 0);

    let html = `
        <button class="cat-pill ${activeCategoryId === 0 ? 'active' : ''}" onclick="selectCategory(0)">
            <span>${t.allCategories}</span>
            <span class="cat-pill-count">${totalCount}</span>
        </button>
    `;

    categoriesList.forEach(c => {
        const name = (currentLang === "ar") ? c.ar : c.en;
        const isActive = (activeCategoryId === c.id);
        html += `
            <button class="cat-pill ${isActive ? 'active' : ''}" onclick="selectCategory(${Number(c.id)})">
                <span>${esc(c.icon || '📦')} ${esc(name)}</span>
                <span class="cat-pill-count">${c.live_count || 0}</span>
            </button>
        `;
    });

    container.innerHTML = html;
}

function selectCategory(catId) {
    activeCategoryId = catId;
    renderCategories();
    updateUrlParams();
    fetchProducts();
}

function esc(value) {
    if (value === null || value === undefined) return "";
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function safeImg(src) {
    const p = String(src || "Branding/logo-100.png");
    return /^https:\/\//i.test(p) ? p : "/" + p.replace(/^\/+/, "");
}

function renderProducts() {
    const grid = document.getElementById("productsGrid");
    const countBox = document.getElementById("resultsInfo");
    const t = i18n[currentLang];

    if (!grid) return;

    // Update count indicator
    let activeCatName = t.allCategories;
    if (activeCategoryId > 0) {
        const found = categoriesList.find(c => c.id === activeCategoryId);
        if (found) activeCatName = (currentLang === "ar") ? found.ar : found.en;
    }

    let spaceSuffix = "";
    if (activeUsageType === "kitchen") spaceSuffix = ` • ${t.kitchenSpace}`;
    else if (activeUsageType === "dressing") spaceSuffix = ` • ${t.dressingSpace}`;
    else if (activeUsageType === "other") spaceSuffix = ` • ${t.otherSpace}`;

    countBox.innerHTML = `${t.itemsShowing} <span class="results-count-bold">${allProducts.length}</span> ${t.ofProducts} ${t.inCategory} (${esc(activeCatName)}${spaceSuffix})`;

    if (allProducts.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🔍</div>
                <h3 style="font-size:18px; margin-bottom:6px;">${t.emptyTitle}</h3>
                <p style="color:var(--text-muted); font-size:14px;">${t.emptySub}</p>
            </div>
        `;
        return;
    }

    let html = "";
    allProducts.forEach((p, idx) => {
        const code = `WOA-${String(p.id || p.n || 0).padStart(4, '0')}`;
        const titlePrimary = esc((currentLang === "ar") ? (p.ar || p.en) : (p.en || p.ar));
        const titleSecondary = esc((currentLang === "ar") ? p.en : p.ar);
        const price = esc(p.price || "0");
        const cat = categoriesList.find(c => c.id === p.category_id) || { ar: "إكسسوارات", en: "Hardware", icon: "📦" };
        const catName = esc((currentLang === "ar") ? cat.ar : cat.en);
        const catIcon = esc(cat.icon);
        const img = esc(safeImg(p.image));
        const pid = Number(p.id);

        // Usage Tag
        const uKey = ["kitchen", "dressing"].includes(p.usage_type) ? p.usage_type : "other";
        const uIcon = (uKey === "kitchen") ? "🍳" : (uKey === "dressing") ? "👔" : "🛋️";
        const uName = esc((currentLang === "ar") ? (p.usage_ar || "أخرى") : (p.usage_en || "Other"));
        const uBadgeClass = `badge-${uKey}`;

        html += `
            <div class="product-card" style="animation-delay: ${Math.min(idx * 0.03, 0.4)}s;">
                <div class="card-img-wrap img-shimmer-wrap" onclick="openQuickView(${pid})">
                    <img src="${img}" alt="${titlePrimary}" loading="lazy" decoding="async" onload="this.classList.add('loaded'); this.parentElement.classList.add('loaded');" onerror="this.onerror=null; this.src='/Branding/logo-100.png'; this.parentElement.classList.add('loaded', 'img-error'); this.classList.add('loaded');">
                </div>
                <div class="card-body">
                    <div class="card-badges-row">
                        <span class="card-top-badge" style="position:static;">${catIcon} ${catName}</span>
                        <span class="card-usage-badge ${uBadgeClass}">${uIcon} ${uName}</span>
                    </div>
                    <div class="card-code">${code}</div>
                    <h3 class="card-title-ar">${titlePrimary}</h3>
                    <p class="card-title-en">${titleSecondary}</p>
                    ${(() => {
                        const isAr = (currentLang === "ar");
                        const colorVal = esc(isAr ? (p.color_ar || '') : (p.color_en || p.color_ar || ''));
                        const lengthVal = esc(isAr ? (p.length_ar || '') : (p.length_en || p.length_ar || ''));
                        const widthVal = esc(isAr ? (p.width_ar || '') : (p.width_en || p.width_ar || ''));
                        const specsVal = esc(isAr ? (p.specs_ar || '') : (p.specs_en || p.specs_ar || ''));
                        if (!colorVal && !lengthVal && !widthVal && !specsVal) return '';
                        return `
                            <div class="product-specs-box">
                                ${colorVal ? `<div class="spec-item"><span class="spec-label">🎨 ${isAr ? 'اللون:' : 'Color:'}</span> <span class="spec-val">${colorVal}</span></div>` : ''}
                                ${lengthVal ? `<div class="spec-item"><span class="spec-label">📏 ${isAr ? 'الطول/المقاس:' : 'Length:'}</span> <span class="spec-val">${lengthVal}</span></div>` : ''}
                                ${widthVal ? `<div class="spec-item"><span class="spec-label">📐 ${isAr ? 'العرض/السمك:' : 'Width:'}</span> <span class="spec-val">${widthVal}</span></div>` : ''}
                                ${specsVal ? `<div class="spec-item spec-general"><span class="spec-label">⚙️ ${isAr ? 'المواصفات:' : 'Specs:'}</span> <span class="spec-val highlight">${specsVal}</span></div>` : ''}
                            </div>
                        `;
                    })()}
                    <div class="card-footer">
                        <div class="card-price-tag">
                            <span>${price}</span>
                            <small>${t.currency}</small>
                        </div>
                        <div class="card-actions-row">
                            <button class="btn-icon-action btn-icon-cart" title="${t.addToCart}" onclick="handleAddToCart(${pid})">🛒</button>
                            <button class="btn-icon-action" title="${t.quickView}" onclick="openQuickView(${pid})">👁️</button>
                            <button class="btn-icon-action btn-icon-whatsapp" title="${t.whatsappOrder}" onclick="orderOnWhatsApp(${pid})">💬</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    if (window.requestAnimationFrame) {
        requestAnimationFrame(() => {
            grid.innerHTML = html;
        });
    } else {
        grid.innerHTML = html;
    }
}

// ----------------- Search & Sort -----------------
let searchDebounceTimer = null;
function setupSearchInput() {
    const input = document.getElementById("mainSearch");
    if (!input) return;

    input.addEventListener("input", (e) => {
        clearTimeout(searchDebounceTimer);
        searchDebounceTimer = setTimeout(() => {
            searchQuery = e.target.value.trim();
            updateUrlParams();
            fetchProducts();
        }, 250);
    });
}

function handleSortChange(select) {
    currentSort = select.value;
    fetchProducts();
}

// ----------------- Quick View Modal -----------------
function openQuickView(prodId) {
    const p = allProducts.find(item => item.id === prodId || item.n === prodId);
    if (!p) return;

    const t = i18n[currentLang];
    const cat = categoriesList.find(c => c.id === p.category_id) || { ar: "إكسسوارات", en: "Hardware", icon: "📦" };
    const code = `WOA-${String(p.id || p.n || 0).padStart(4, '0')}`;
    const img = safeImg(p.image);

    const uKey = p.usage_type || "other";
    const uIcon = (uKey === "kitchen") ? "🍳" : (uKey === "dressing") ? "👔" : "🛋️";
    const uName = (currentLang === "ar") ? (p.usage_ar || "أخرى") : (p.usage_en || "Other");

    const mImg = document.getElementById("modalImg");
    const mWrap = document.getElementById("modalImgWrap") || (mImg ? mImg.parentElement : null);
    if (mImg) {
        mImg.classList.remove("loaded");
        if (mWrap) mWrap.classList.remove("loaded", "img-error");
        mImg.src = img;
        if (mImg.complete && mImg.naturalWidth > 0) {
            mImg.classList.add("loaded");
            if (mWrap) mWrap.classList.add("loaded");
        }
    }
    document.getElementById("modalCatBadge").textContent = `${cat.icon} ${(currentLang === "ar") ? cat.ar : cat.en}`;
    document.getElementById("modalUsageBadge").textContent = `${uIcon} ${uName}`;
    document.getElementById("modalTitleAr").textContent = (currentLang === "ar") ? p.ar : p.en;
    document.getElementById("modalTitleEn").textContent = (currentLang === "ar") ? p.en : p.ar;
    document.getElementById("modalPrice").textContent = `${p.price} ${t.currency}`;
    document.getElementById("modalCodeVal").textContent = code;

    const modalSpecsEl = document.getElementById("modalSpecsBox");
    if (modalSpecsEl) {
        const isAr = (currentLang === "ar");
        const colorVal = esc(isAr ? (p.color_ar || '') : (p.color_en || p.color_ar || ''));
        const lengthVal = esc(isAr ? (p.length_ar || '') : (p.length_en || p.length_ar || ''));
        const widthVal = esc(isAr ? (p.width_ar || '') : (p.width_en || p.width_ar || ''));
        const specsVal = esc(isAr ? (p.specs_ar || '') : (p.specs_en || p.specs_ar || ''));

        if (colorVal || lengthVal || widthVal || specsVal) {
            modalSpecsEl.innerHTML = `
                ${colorVal ? `<div class="spec-item"><span class="spec-label">🎨 ${isAr ? 'اللون المعتمد:' : 'Color:'}</span> <span class="spec-val">${colorVal}</span></div>` : ''}
                ${lengthVal ? `<div class="spec-item"><span class="spec-label">📏 ${isAr ? 'الطول / المقاس:' : 'Length / Size:'}</span> <span class="spec-val">${lengthVal}</span></div>` : ''}
                ${widthVal ? `<div class="spec-item"><span class="spec-label">📐 ${isAr ? 'العرض / السُمك:' : 'Width / Thickness:'}</span> <span class="spec-val">${widthVal}</span></div>` : ''}
                ${specsVal ? `<div class="spec-item spec-general"><span class="spec-label">⚙️ ${isAr ? 'المواصفات العامة والمميزات:' : 'Specs & Features:'}</span> <span class="spec-val highlight">${specsVal}</span></div>` : ''}
            `;
            modalSpecsEl.style.display = 'flex';
        } else {
            modalSpecsEl.style.display = 'none';
        }
    }

    const qtyInp = document.getElementById("modalQtyInput");
    if (qtyInp) qtyInp.value = 1;

    document.getElementById("modalWhatsAppBtn").onclick = () => {
        const q = qtyInp ? parseInt(qtyInp.value) || 1 : 1;
        orderOnWhatsApp(prodId, q);
    };
    document.getElementById("modalCopyBtn").onclick = () => copySkuCode(code);
    const addCartModalBtn = document.getElementById("modalAddToCartBtn");
    if (addCartModalBtn) {
        addCartModalBtn.onclick = () => {
            const q = qtyInp ? parseInt(qtyInp.value) || 1 : 1;
            handleAddToCart(prodId, q);
            closeQuickView();
        };
    }

    const modal = document.getElementById("quickViewModal");
    modal.classList.add("open");
}

function adjustModalQty(delta) {
    const input = document.getElementById("modalQtyInput");
    if (!input) return;
    let val = (parseInt(input.value) || 1) + delta;
    if (val < 1) val = 1;
    if (val > 999) val = 999;
    input.value = val;
}

function closeQuickView() {
    const modal = document.getElementById("quickViewModal");
    if (modal) modal.classList.remove("open");
}

function handleAddToCart(prodId, qty = 1) {
    const p = allProducts.find(item => item.id === prodId || item.n === prodId);
    if (!p) return;
    if (window.WOACart) {
        window.WOACart.addItem(p, qty);
    }
}

function copySkuCode(code) {
    navigator.clipboard.writeText(code).then(() => {
        alert(i18n[currentLang].copiedToast);
    });
}

function orderOnWhatsApp(prodId, qty = 1) {
    const p = allProducts.find(item => item.id === prodId || item.n === prodId);
    if (!p) return;

    const code = `WOA-${String(p.id || p.n || 0).padStart(4, '0')}`;
    const title = (currentLang === "ar") ? p.ar : p.en;
    const qtyTxt = (qty > 1) ? `\n🔢 الكمية المطلوبة: ${qty} قطعة` : '';
    const isAr = (currentLang === "ar");
    const greeting = isAr ? 'مرحباً عالم الاكسسوار، أود الاستفسار وطلب المنتج:' : 'Hello Accessories World, I would like to order:';
    const msg = `${greeting}\n\n🏷️ الاسم: ${title}\n🔖 الكود: ${code}\n💰 السعر: ${p.price} EGP${qtyTxt}\n\nيرجى تأكيد التوافر والتفاصيل.`;
    const waUrl = `https://wa.me/201140030036?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, "_blank");
}

// ----------------- PWA Service Worker & Install Flow -----------------
let pwaDeferredPrompt = null;

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then((reg) => {
            console.log('[PWA] Service Worker registered with scope:', reg.scope);
        }).catch((err) => {
            console.warn('[PWA] Service Worker registration failed:', err);
        });
    });
}

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    pwaDeferredPrompt = e;
    const btn = document.getElementById('pwaInstallNavBtn');
    if (btn) btn.style.display = 'inline-flex';
});

window.addEventListener('appinstalled', () => {
    console.log('[PWA] App successfully installed');
    pwaDeferredPrompt = null;
    const btn = document.getElementById('pwaInstallNavBtn');
    if (btn) btn.style.display = 'none';
});

function triggerPwaInstall() {
    if (!pwaDeferredPrompt) return;
    pwaDeferredPrompt.prompt();
    pwaDeferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
            console.log('[PWA] User accepted installation prompt');
        }
        pwaDeferredPrompt = null;
        const btn = document.getElementById('pwaInstallNavBtn');
        if (btn) btn.style.display = 'none';
    });
}

