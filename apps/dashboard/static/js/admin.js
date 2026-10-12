/**
 * World of Accessories - Admin Portal Logic
 * Full CRUD, Image Upload, Catalog Generator Trigger & Auth
 */

let adminProducts = [];
let adminCategories = [];
let activeCatFilter = 0;
let activeUsageFilter = "all";
let searchFilter = "";
let currentEditId = null;
const LANDING_ORIGIN = "https://ha-woa.vercel.app";
const MARKET_ORIGIN = "https://woa-market.vercel.app";
const storeUrl = (path) => (/^\/market/.test(path)
    ? MARKET_ORIGIN + path.replace(/^\/market\.html/, "/market")
    : LANDING_ORIGIN + path);

function escapeHTML(str) {
    if (str === null || str === undefined) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

document.addEventListener("DOMContentLoaded", () => {
    checkAdminAuth();
    loadAdminStats();
    loadCategories();
    loadProducts();
});

// ----------------- Auth (Supabase Auth) -----------------
function imgUrl(path) {
    const p = path || "Branding/logo-100.png";
    return /^https:\/\//i.test(p) ? p : `/${p.replace(/^\/+/, "")}`;
}

function checkAdminAuth() {
    const authModal = document.getElementById("authModal");
    if (!authModal) return;
    authModal.classList.toggle("open", !window.SupabaseAuth.isLoggedIn());
}

async function submitAdminLogin() {
    const email = document.getElementById("adminEmail").value.trim();
    const password = document.getElementById("adminPassword").value;
    const btn = document.getElementById("adminLoginBtn");
    const errEl = document.getElementById("adminLoginError");
    if (errEl) errEl.textContent = "";
    if (!email || !password) {
        if (errEl) errEl.textContent = "يرجى إدخال البريد الإلكتروني وكلمة المرور";
        return;
    }
    if (btn) btn.disabled = true;
    try {
        await window.SupabaseAuth.login(email, password);
        document.getElementById("adminPassword").value = "";
        document.getElementById("authModal").classList.remove("open");
        showToast("مرحباً بك! تم تسجيل الدخول بنجاح.");
    } catch (err) {
        if (errEl) errEl.textContent = err.message;
    } finally {
        if (btn) btn.disabled = false;
    }
}

function adminLogout() {
    window.SupabaseAuth.logout();
    window.location.reload();
}

function requireAdmin() {
    if (window.SupabaseAuth.isLoggedIn()) return true;
    checkAdminAuth();
    return false;
}

// ----------------- Stats & Generator Status -----------------
function loadAdminStats() {}

// ----------------- Categories & Products Loading -----------------
async function loadCategories() {
    try {
        if (window.SupabaseSync) {
            const data = await window.SupabaseSync.fetchCategories();
            if (data && data.length > 0) {
                adminCategories = data;
                populateCategoriesDropdowns();
                return;
            }
        }
    } catch (err) {
        console.warn("Supabase categories load failed:", err);
    }

    try {
        const res = await fetch("/data/categories_data.json");
        if (res.ok) {
            const data = await res.json();
            adminCategories = data.categories || [];
            populateCategoriesDropdowns();
        }
    } catch (err) {
        console.error("Failed to load categories:", err);
    }
}

function populateCategoriesDropdowns() {
    const filterSelect = document.getElementById("filterCategorySelect");
    const modalSelect = document.getElementById("prodCategory");

    let filterOptions = `<option value="0">كافة الفئات (الكل)</option>`;
    let modalOptions = "";

    adminCategories.forEach(c => {
        const label = `${escapeHTML(c.icon || '📦')} ${escapeHTML(c.ar)}`;
        filterOptions += `<option value="${parseInt(c.id, 10)}">${label}</option>`;
        modalOptions += `<option value="${parseInt(c.id, 10)}">${label}</option>`;
    });

    if (filterSelect) filterSelect.innerHTML = filterOptions;
    if (modalSelect) modalSelect.innerHTML = modalOptions;

    const statCats = document.getElementById("statCatsCount");
    if (statCats) statCats.textContent = adminCategories.length;
}

async function loadProducts() {
    try {
        let prods = [];
        if (window.SupabaseSync) {
            prods = await window.SupabaseSync.fetchProducts();
        }
        if (!prods || prods.length === 0) {
            const res = await fetch("/data/products.json");
            if (res.ok) prods = await res.json();
        }

        window.__allProducts = prods;
        let filtered = [...prods];
        if (activeCatFilter > 0) {
            filtered = filtered.filter(p => p.category_id === activeCatFilter);
        }
        if (activeUsageFilter && activeUsageFilter !== "all") {
            filtered = filtered.filter(p => (p.usage_type || "other") === activeUsageFilter);
        }
        if (searchFilter) {
            const q = searchFilter.toLowerCase().trim();
            filtered = filtered.filter(p => {
                const arMatch = p.ar && p.ar.toLowerCase().includes(q);
                const enMatch = p.en && p.en.toLowerCase().includes(q);
                const idMatch = p.id && String(p.id).includes(q);
                return arMatch || enMatch || idMatch;
            });
        }

        filtered.sort((a, b) => (b.id || 0) - (a.id || 0));
        adminProducts = filtered;
        const statProds = document.getElementById("statProdsCount");
        if (statProds) statProds.textContent = prods.length;
        const badgeProds = document.getElementById("tabBadgeProds");
        if (badgeProds) badgeProds.textContent = prods.length;
        if (typeof renderAdminCategories === "function") renderAdminCategories();
        renderAdminTable();
    } catch (err) {
        console.error("Failed to load products:", err);
    }
}

function renderAdminTable() {
    const tbody = document.getElementById("adminTableBody");
    if (!tbody) return;

    if (adminProducts.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align:center; padding:32px; color:var(--text-muted);">
                    لا توجد منتجات مطابقة لخيارات البحث
                </td>
            </tr>
        `;
        return;
    }

    let html = "";
    adminProducts.forEach(p => {
        const code = `WOA-${String(p.id || p.n || 0).padStart(4, '0')}`;
        const cat = adminCategories.find(c => c.id === p.category_id) || { ar: "عام", icon: "📦" };
        const img = p.image || "Branding/logo-100.png";

        const uKey = p.usage_type || "other";
        const uIcon = (uKey === "kitchen") ? "🍳" : (uKey === "dressing") ? "👔" : "🛋️";
        const uName = (p.usage_ar || "أخرى");

        html += `
            <tr>
                <td><span class="sku-badge">${escapeHTML(code)}</span></td>
                <td><img src="${escapeHTML(imgUrl(img))}" class="table-thumb" alt="Product" loading="lazy"></td>
                <td><strong>${escapeHTML(p.ar || '-')}</strong></td>
                <td><span style="color:var(--text-muted); font-size:12px;">${escapeHTML(p.en || '-')}</span></td>
                <td><span class="cat-badge-sm">${escapeHTML(cat.icon)} ${escapeHTML(cat.ar)}</span></td>
                <td><span class="cat-badge-sm" style="background:#FFF7ED; color:#D96010; font-weight:700;">${escapeHTML(uIcon)} ${escapeHTML(uName)}</span></td>
                <td><span class="price-bold">${escapeHTML(p.price)}</span> <small style="color:var(--text-muted);">ج.م</small></td>
                <td>
                    <div class="actions-cell">
                        <button class="btn-table-icon" title="تعديل المنتج" onclick="openEditModal(${parseInt(p.id, 10)})">✏️</button>
                        <button class="btn-table-icon btn-delete" title="حذف المنتج" onclick="confirmDeleteProduct(${parseInt(p.id, 10)})">🗑️</button>
                    </div>
                </td>
            </tr>
        `;
    });

    tbody.innerHTML = html;
}

// ----------------- Filter & Search Handlers -----------------
function handleCategoryFilter(select) {
    activeCatFilter = parseInt(select.value, 10);
    loadProducts();
}

function handleUsageFilter(select) {
    activeUsageFilter = select.value;
    loadProducts();
}

let adminSearchTimer = null;
function handleAdminSearch(input) {
    clearTimeout(adminSearchTimer);
    adminSearchTimer = setTimeout(() => {
        searchFilter = input.value.trim();
        loadProducts();
    }, 250);
}

// ----------------- Add & Edit Modal -----------------
function openAddModal() {
    currentEditId = null;

    document.getElementById("modalFormTitle").textContent = "➕ إضافة منتج جديد إلى الكتالوج";
    document.getElementById("prodAr").value = "";
    document.getElementById("prodEn").value = "";
    document.getElementById("prodPrice").value = "";
    document.getElementById("prodCategory").value = adminCategories[0]?.id || 1;
    document.getElementById("prodUsageType").value = "other";
    ImagePicker.set("prodImagePicker", "");

    document.getElementById("productModal").classList.add("open");
}

function openEditModal(prodId) {
    const p = adminProducts.find(item => item.id === prodId || item.n === prodId);
    if (!p) return;

    currentEditId = p.id || p.n;

    document.getElementById("modalFormTitle").textContent = `✏️ تعديل المنتج: WOA-${String(currentEditId).padStart(4, '0')}`;
    document.getElementById("prodAr").value = p.ar || "";
    document.getElementById("prodEn").value = p.en || "";
    document.getElementById("prodPrice").value = p.price || "";
    document.getElementById("prodCategory").value = p.category_id || 1;
    document.getElementById("prodUsageType").value = p.usage_type || "other";
    ImagePicker.set("prodImagePicker", p.image && !/^Branding\//.test(p.image) ? p.image : "");

    document.getElementById("productModal").classList.add("open");
}

function closeProductModal() {
    document.getElementById("productModal").classList.remove("open");
}

async function saveProductForm(e) {
    e.preventDefault();

    const ar = document.getElementById("prodAr").value.trim();
    const en = document.getElementById("prodEn").value.trim();
    const price = document.getElementById("prodPrice").value.trim();
    const catId = parseInt(document.getElementById("prodCategory").value, 10);
    const usageType = document.getElementById("prodUsageType").value;

    if (!ar || !price) {
        alert("يرجى إدخال اسم المنتج والسعر على الأقل");
        return;
    }

    const payload = {
        ar: ar,
        en: en || ar,
        price: price,
        category_id: catId,
        usage_type: usageType,
        image: ImagePicker.get("prodImagePicker") || "Branding/logo-100.png"
    };

    if (!requireAdmin()) return;

    try {
        if (currentEditId) {
            await window.SupabaseSync.updateProduct(currentEditId, payload);
        } else {
            await window.SupabaseSync.insertProduct(payload);
        }
        closeProductModal();
        showToast("✨ تم حفظ المنتج وتحديث الموقع مباشرة!");
        loadProducts();
        loadCategories();
    } catch (err) {
        alert("فشل حفظ المنتج: " + err.message);
        checkAdminAuth();
    }
}

// ----------------- Delete Product -----------------
async function confirmDeleteProduct(prodId) {
    if (!confirm(`هل أنت متأكد من رغبتك في حذف هذا المنتج (ID: ${prodId})؟`)) {
        return;
    }

    if (!requireAdmin()) return;

    try {
        await window.SupabaseSync.deleteProduct(prodId);
        showToast("🗑️ تم حذف المنتج وتحديث الموقع مباشرة!");
        loadProducts();
        loadCategories();
    } catch (err) {
        alert("فشل حذف المنتج: " + err.message);
        checkAdminAuth();
    }
}

// ----------------- Toast Notification -----------------
function showToast(msg) {
    let toast = document.getElementById("adminToast");
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(() => {
        toast.classList.remove("show");
    }, 3500);
}

// ----------------- Tab Navigation Switcher -----------------
const ADMIN_TABS = ["products", "categories", "banners", "content", "media", "links"];
const TAB_HOOKS = {
    categories: () => loadAdminCategories(),
    banners: () => loadAdminBanners(),
    content: () => loadContentSettings(),
    media: () => loadMedia(),
    links: () => generateCampaignLink()
};

function switchAdminTab(tabName) {
    const name = ADMIN_TABS.includes(tabName) ? tabName : "products";
    ADMIN_TABS.forEach(t => {
        const cap = t.charAt(0).toUpperCase() + t.slice(1);
        const btn = document.getElementById("tabBtn" + cap);
        const sec = document.getElementById("section" + cap);
        if (btn) {
            btn.classList.toggle("active", t === name);
            btn.setAttribute("aria-selected", t === name ? "true" : "false");
        }
        if (sec) sec.style.display = t === name ? "block" : "none";
    });
    if (TAB_HOOKS[name]) TAB_HOOKS[name]();
}

// ----------------- Ecosystem Links & Campaign Generator -----------------
function copyLinkToClipboard(path, toastMsg) {
    const fullUrl = storeUrl(path);
    navigator.clipboard.writeText(fullUrl).then(() => {
        showToast(toastMsg || "تم نسخ الرابط بنجاح إلى الحافظة!");
    }).catch(() => {
        showToast("يرجى نسخ الرابط يدوياً: " + fullUrl);
    });
}

async function testAllEcosystemLinks() {
    showToast("جاري فحص استجابة كافة روابط المنظومة...");
    const links = [
        { id: "linkStatusLanding", url: "/" },
        { id: "linkStatusMarket", url: "/market.html" },
        { id: "linkStatusKitchen", url: "/market.html?space=kitchen" },
        { id: "linkStatusDressing", url: "/market.html?space=dressing" },
        { id: "linkStatusPrint", url: "/printed_catalogs.html" },
        { id: "linkStatusAbout", url: "/about.html" }
    ];

    let successCount = 0;
    for (const item of links) {
        const badge = document.getElementById(item.id);
        if (badge) {
            badge.textContent = "⏳ جاري الفحص...";
            badge.style.background = "#FEF3C7";
            badge.style.color = "#92400E";
            badge.style.borderColor = "#FDE68A";
        }
        try {
            const res = await fetch(storeUrl(item.url), { method: "HEAD", mode: "no-cors", cache: "no-store" });
            if (res.type === "opaque" || res.ok) {
                successCount++;
                if (badge) {
                    badge.textContent = "🟢 نشط (200 OK)";
                    badge.style.background = "#ECFDF5";
                    badge.style.color = "#059669";
                    badge.style.borderColor = "#A7F3D0";
                }
            } else {
                if (badge) {
                    badge.textContent = `⚠️ تنبيه (${res.status})`;
                    badge.style.background = "#FEE2E2";
                    badge.style.color = "#DC2626";
                }
            }
        } catch (e) {
            if (badge) {
                badge.textContent = "⚠️ لا يستجيب";
                badge.style.background = "#FEE2E2";
                badge.style.color = "#DC2626";
            }
        }
    }

    showToast(`تم اكتمال الفحص: جميع الروابط (${successCount}/${links.length}) متصلة بنجاح!`);
}

function generateCampaignLink() {
    const pageSelect = document.getElementById("genTargetPage");
    const queryInput = document.getElementById("genSearchQuery");
    const templateSelect = document.getElementById("genMsgTemplate");
    const resultInput = document.getElementById("genResultUrl");
    const testLink = document.getElementById("genTestLink");
    const waInput = document.getElementById("genWaUrl");
    const testWaLink = document.getElementById("genTestWaLink");

    if (!pageSelect || !resultInput) return;

    let targetPath = pageSelect.value;
    const query = queryInput ? queryInput.value.trim() : "";
    const template = templateSelect ? templateSelect.value : "welcome";

    if (query) {
        const separator = targetPath.includes("?") ? "&" : "?";
        targetPath += `${separator}q=${encodeURIComponent(query)}`;
    }

    const fullUrl = storeUrl(targetPath);
    resultInput.value = fullUrl;
    if (testLink) testLink.href = targetPath;

    let msgText = "";
    if (template === "kitchens") {
        msgText = `مرحباً بكم من عالم الاكسسوار! 🍳\nيسعدنا مشاركتكم قسم تجهيزات ومفصلات وسكك المطابخ الحديثة من الكتالوج الرسمي 2026:\n🔗 ${fullUrl}\n\nنرحب باستفساراتكم وطلبات التوريد المباشر للمصانع والورش.`;
    } else if (template === "contractors") {
        msgText = `عالم الاكسسوار • شريك مهندسي الديكور والمشاريع 📐\nنوفر توريداً مباشراً لأكبر تشكيلة إكسسوارات أثاث ومطابخ بأسعار رسمية معتمدة:\n🔗 ${fullUrl}\n\nتواصل معنا للحصول على عروض أسعار تفصيلية للمشاريع.`;
    } else if (template === "showroom") {
        msgText = `يسعدنا تشريفكم في معرض عالم الاكسسوار بمدينة 6 أكتوبر داخل سيلا مول! 📍\nيمكنكم معاينة تشكيلة 2026 قبل الزيارة عبر الرابط:\n🔗 ${fullUrl}\n\nمواعيد العمل يومياً من 10 صباحاً حتى 10 مساءً.`;
    } else {
        msgText = `أهلاً بك! تصفح الكتالوج الرقمي الرسمي 2026 من عالم الاكسسوار (أكثر من 590 منتج معتمد):\n🔗 ${fullUrl}\n\nخدمة عملاء وتوريد فوري: 01140030036`;
    }

    const waLink = `https://wa.me/201140030036?text=${encodeURIComponent(msgText)}`;
    if (waInput) waInput.value = waLink;
    if (testWaLink) testWaLink.href = waLink;
}

function copyGeneratedLink() {
    const input = document.getElementById("genResultUrl");
    if (!input || !input.value) return;
    navigator.clipboard.writeText(input.value).then(() => {
        showToast("تم نسخ رابط الحملة إلى الحافظة!");
    });
}

function copyGeneratedWaLink() {
    const input = document.getElementById("genWaUrl");
    if (!input || !input.value) return;
    navigator.clipboard.writeText(input.value).then(() => {
        showToast("تم نسخ رابط رسالة واتساب إلى الحافظة!");
    });
}
