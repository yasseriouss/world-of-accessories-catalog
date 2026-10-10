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
        brandTitle: "عالم الإكسسوارات",
        brandSub: "World of Accessories • Official Catalog",
        heroPill: "✨ تشكيلة ٢٠٢٦ الفاخرة • Official 2026 Collection",
        heroTitle: "عالم من إكسسوارات الأثاث والمطابخ الفاخرة",
        heroSub: "تصفح تشكيلة متكاملة تضم أكثر من ٥٩٠ منتجاً عالي الجودة من مفصلات، مقابض، وسكك حركة، مع الأسعار الرسمية المعتمدة بالجنيه المصري.",
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
        socialTitle: "منصات التواصل الاجتماعي الرسمية"
    },
    en: {
        brandTitle: "World of Accessories",
        brandSub: "Premium Hardware & Architectural Fittings",
        heroPill: "✨ Official 2026 Collection • High Quality Hardware",
        heroTitle: "Premium Furniture & Kitchen Hardware Fittings",
        heroSub: "Explore an executive collection of over 590 certified hardware fittings: soft-close hinges, modern handles, and precision drawer systems with official certified EGP pricing.",
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
        socialTitle: "Official Social Media Channels"
    }
};

// Initialize on DOM load
document.addEventListener("DOMContentLoaded", () => {
    applyLanguage(currentLang);
    fetchUsageTypes();
    fetchCategories();
    fetchProducts();
    setupSearchInput();
});

// ----------------- Language Management -----------------
function toggleLanguage() {
    currentLang = (currentLang === "ar") ? "en" : "ar";
    localStorage.setItem("woa_lang", currentLang);
    applyLanguage(currentLang);
    renderUsageFilterBar();
    renderCategories();
    renderProducts();
}

function applyLanguage(lang) {
    document.documentElement.lang = lang;
    document.documentElement.dir = (lang === "ar") ? "rtl" : "ltr";
    const t = i18n[lang];

    document.getElementById("navBrandTitle").textContent = t.brandTitle;
    document.getElementById("navBrandSub").textContent = t.brandSub;
    document.getElementById("langToggleBtn").textContent = t.langBtn;
    const adminBtn = document.getElementById("navAdminBtn");
    if (adminBtn) adminBtn.textContent = t.adminBtn;
    const printedBtn = document.getElementById("navPrintedBtn");
    if (printedBtn) printedBtn.textContent = t.printedBtn;

    document.getElementById("heroPill").textContent = t.heroPill;
    document.getElementById("heroTitle").textContent = t.heroTitle;
    document.getElementById("heroSub").textContent = t.heroSub;
    document.getElementById("mainSearch").placeholder = t.searchPlaceholder;

    document.getElementById("metricLabel1").textContent = t.certifiedItems;
    document.getElementById("metricLabel2").textContent = t.specializedCategories;
    document.getElementById("metricLabel3").textContent = t.officialPrices;

    const cTitle = document.getElementById("contactTitle");
    if (cTitle) cTitle.textContent = t.contactTitle;
    const cSub = document.getElementById("contactSub");
    if (cSub) cSub.textContent = t.contactSub;
    const lTitle = document.getElementById("locTitle");
    if (lTitle) lTitle.textContent = t.locTitle;
    const lDesc = document.getElementById("locDesc");
    if (lDesc) lDesc.textContent = t.locDesc;
    const pTitle = document.getElementById("phoneTitle");
    if (pTitle) pTitle.textContent = t.phoneTitle;
    const wTitle = document.getElementById("waTitle");
    if (wTitle) wTitle.textContent = t.waTitle;
    const sTitle = document.getElementById("socialTitle");
    if (sTitle) sTitle.textContent = t.socialTitle;
}

// ----------------- API Data Fetching -----------------
// ----------------- Supabase Live Data Fetching with Resilient Fallback -----------------
let cachedRawProducts = null;

async function getRawProductsData(forceRefresh = false) {
    if (cachedRawProducts && !forceRefresh) return cachedRawProducts;
    
    // 1. Try Supabase Live Database
    if (window.SupabaseSync) {
        try {
            const data = await window.SupabaseSync.fetchProducts();
            if (data && data.length > 0) {
                cachedRawProducts = data;
                return cachedRawProducts;
            }
        } catch (e) {
            console.warn("Supabase fetch failed, falling back:", e);
        }
    }

    // 2. Fallback to static JSON
    try {
        const res = await fetch("/data/products.json");
        if (res.ok) {
            cachedRawProducts = await res.json();
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

    // Client-side filtering fallback
    const raw = await getRawProductsData();
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
            <button class="cat-pill ${isActive ? 'active' : ''}" onclick="selectCategory(${c.id})">
                <span>${c.icon || '📦'} ${name}</span>
                <span class="cat-pill-count">${c.live_count || 0}</span>
            </button>
        `;
    });

    container.innerHTML = html;
}

function selectCategory(catId) {
    activeCategoryId = catId;
    renderCategories();
    fetchProducts();
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

    countBox.innerHTML = `${t.itemsShowing} <span class="results-count-bold">${allProducts.length}</span> ${t.ofProducts} ${t.inCategory} (${activeCatName}${spaceSuffix})`;

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
        const titlePrimary = (currentLang === "ar") ? (p.ar || p.en) : (p.en || p.ar);
        const titleSecondary = (currentLang === "ar") ? p.en : p.ar;
        const price = p.price || "0";
        const cat = categoriesList.find(c => c.id === p.category_id) || { ar: "إكسسوارات", en: "Hardware", icon: "📦" };
        const catName = (currentLang === "ar") ? cat.ar : cat.en;
        const img = p.image || "Branding/logo-100.png";

        // Usage Tag
        const uKey = p.usage_type || "other";
        const uIcon = (uKey === "kitchen") ? "🍳" : (uKey === "dressing") ? "👔" : "🛋️";
        const uName = (currentLang === "ar") ? (p.usage_ar || "أخرى") : (p.usage_en || "Other");
        const uBadgeClass = `badge-${uKey}`;

        html += `
            <div class="product-card" style="animation-delay: ${Math.min(idx * 0.03, 0.4)}s;">
                <div class="card-img-wrap" onclick="openQuickView(${p.id})">
                    <img src="${img}" alt="${titlePrimary}" loading="lazy">
                </div>
                <div class="card-body">
                    <div class="card-badges-row">
                        <span class="card-top-badge" style="position:static;">${cat.icon} ${catName}</span>
                        <span class="card-usage-badge ${uBadgeClass}">${uIcon} ${uName}</span>
                    </div>
                    <div class="card-code">${code}</div>
                    <h3 class="card-title-ar">${titlePrimary}</h3>
                    <p class="card-title-en">${titleSecondary}</p>
                    <div class="card-footer">
                        <div class="card-price-tag">
                            <span>${price}</span>
                            <small>${t.currency}</small>
                        </div>
                        <div class="card-actions-row">
                            <button class="btn-icon-action" title="${t.quickView}" onclick="openQuickView(${p.id})">👁️</button>
                            <button class="btn-icon-action btn-icon-whatsapp" title="${t.whatsappOrder}" onclick="orderOnWhatsApp(${p.id})">💬</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    grid.innerHTML = html;
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
    const img = p.image || "Branding/logo-100.png";

    const uKey = p.usage_type || "other";
    const uIcon = (uKey === "kitchen") ? "🍳" : (uKey === "dressing") ? "👔" : "🛋️";
    const uName = (currentLang === "ar") ? (p.usage_ar || "أخرى") : (p.usage_en || "Other");

    document.getElementById("modalImg").src = img;
    document.getElementById("modalCatBadge").textContent = `${cat.icon} ${(currentLang === "ar") ? cat.ar : cat.en}`;
    document.getElementById("modalUsageBadge").innerHTML = `${uIcon} ${uName}`;
    document.getElementById("modalTitleAr").textContent = (currentLang === "ar") ? p.ar : p.en;
    document.getElementById("modalTitleEn").textContent = (currentLang === "ar") ? p.en : p.ar;
    document.getElementById("modalPrice").textContent = `${p.price} ${t.currency}`;
    document.getElementById("modalCodeVal").textContent = code;

    document.getElementById("modalWhatsAppBtn").onclick = () => orderOnWhatsApp(prodId);
    document.getElementById("modalCopyBtn").onclick = () => copySkuCode(code);

    const modal = document.getElementById("quickViewModal");
    modal.classList.add("open");
}

function closeQuickView() {
    const modal = document.getElementById("quickViewModal");
    if (modal) modal.classList.remove("open");
}

function copySkuCode(code) {
    navigator.clipboard.writeText(code).then(() => {
        alert(i18n[currentLang].copiedToast);
    });
}

function orderOnWhatsApp(prodId) {
    const p = allProducts.find(item => item.id === prodId || item.n === prodId);
    if (!p) return;

    const code = `WOA-${String(p.id || p.n || 0).padStart(4, '0')}`;
    const title = (currentLang === "ar") ? p.ar : p.en;
    const msg = `مرحباً عالم الإكسسوارات، أود الاستفسار عن المنتج:\n\n🏷️ الاسم: ${title}\n🔖 الكود: ${code}\n💰 السعر: ${p.price} جنيه مصري\n\nيرجى تأكيد التوافر والتفاصيل.`;
    const waUrl = `https://wa.me/201140030036?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, "_blank");
}
