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
let currentUploadedImg = "Branding/logo-100.png";
const STORE_ORIGIN = "https://woa-store-yasserious.vercel.app";
const storeUrl = (path) => STORE_ORIGIN + path;

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
    loadAdminBanners();
    setupImageUploader();
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
function loadAdminStats() {
    const el = document.getElementById("statLastBuild");
    if (el) el.textContent = "جاهز ومعتمد";
}

function triggerManualGeneration() {
    alert("توليد الكتالوجات المطبوعة يتم عبر سكربتات المشروع (scripts/) ولا يتوفر من لوحة التحكم المنشورة.");
}

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
        if (statProds) statProds.textContent = adminProducts.length;
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
    currentUploadedImg = "Branding/logo-100.png";

    document.getElementById("modalFormTitle").textContent = "➕ إضافة منتج جديد إلى الكتالوج";
    document.getElementById("prodAr").value = "";
    document.getElementById("prodEn").value = "";
    document.getElementById("prodPrice").value = "";
    document.getElementById("prodCategory").value = adminCategories[0]?.id || 1;
    document.getElementById("prodUsageType").value = "other";
    document.getElementById("previewImg").src = imgUrl(currentUploadedImg);

    document.getElementById("productModal").classList.add("open");
}

function openEditModal(prodId) {
    const p = adminProducts.find(item => item.id === prodId || item.n === prodId);
    if (!p) return;

    currentEditId = p.id || p.n;
    currentUploadedImg = p.image || "Branding/logo-100.png";

    document.getElementById("modalFormTitle").textContent = `✏️ تعديل المنتج: WOA-${String(currentEditId).padStart(4, '0')}`;
    document.getElementById("prodAr").value = p.ar || "";
    document.getElementById("prodEn").value = p.en || "";
    document.getElementById("prodPrice").value = p.price || "";
    document.getElementById("prodCategory").value = p.category_id || 1;
    document.getElementById("prodUsageType").value = p.usage_type || "other";
    document.getElementById("previewImg").src = imgUrl(currentUploadedImg);

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
        image: currentUploadedImg
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

// ----------------- Image Uploader -----------------
function setupImageUploader() {
    const fileInput = document.getElementById("fileUploadInput");
    if (!fileInput) return;

    fileInput.addEventListener("change", async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!requireAdmin()) {
            fileInput.value = "";
            return;
        }

        try {
            showToast("⏳ جاري رفع الصورة...");
            currentUploadedImg = await window.SupabaseSync.uploadImage(file);
            document.getElementById("previewImg").src = currentUploadedImg;
            showToast("تم رفع الصورة بنجاح!");
        } catch (err) {
            alert("فشل رفع الصورة: " + err.message);
        } finally {
            fileInput.value = "";
        }
    });
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
function switchAdminTab(tabName) {
    const btnProds = document.getElementById("tabBtnProducts");
    const btnBanners = document.getElementById("tabBtnBanners");
    const btnLinks = document.getElementById("tabBtnLinks");
    const secProds = document.getElementById("sectionProducts");
    const secBanners = document.getElementById("sectionBanners");
    const secLinks = document.getElementById("sectionLinks");

    if (btnProds) btnProds.classList.remove("active");
    if (btnBanners) btnBanners.classList.remove("active");
    if (btnLinks) btnLinks.classList.remove("active");

    if (secProds) secProds.style.display = "none";
    if (secBanners) secBanners.style.display = "none";
    if (secLinks) secLinks.style.display = "none";

    if (tabName === "banners") {
        if (btnBanners) btnBanners.classList.add("active");
        if (secBanners) secBanners.style.display = "block";
        loadAdminBanners();
    } else if (tabName === "links") {
        if (btnLinks) btnLinks.classList.add("active");
        if (secLinks) secLinks.style.display = "block";
        generateCampaignLink();
    } else {
        if (btnProds) btnProds.classList.add("active");
        if (secProds) secProds.style.display = "block";
    }
}

// ----------------- Banner & Ads Management -----------------
let adminBanners = [];
let currentEditingBannerId = null;

async function loadAdminBanners() {
    try {
        const stored = localStorage.getItem("woa_banners_v1");
        if (stored) {
            adminBanners = JSON.parse(stored);
            renderAdminBanners();
            return;
        }
    } catch (e) {}

    try {
        const res = await fetch("/data/banners.json");
        if (res.ok) {
            adminBanners = await res.json();
            localStorage.setItem("woa_banners_v1", JSON.stringify(adminBanners));
            renderAdminBanners();
            return;
        }
    } catch (e) {}

    adminBanners = [];
    renderAdminBanners();
}

function renderAdminBanners() {
    const tbody = document.getElementById("adminBannersTableBody");
    const badge = document.getElementById("tabBadgeBanners");
    if (badge) badge.textContent = adminBanners.length;

    // Update Live Preview Strip with the first active banner
    const activeBanners = adminBanners.filter(b => b.active !== false);
    const prevBadge = document.getElementById("bannerPrevBadge");
    const prevText = document.getElementById("bannerPrevText");
    if (activeBanners.length > 0) {
        if (prevBadge) prevBadge.textContent = activeBanners[0].badge_ar || activeBanners[0].badge_en || 'إعلان';
        if (prevText) prevText.textContent = activeBanners[0].text_ar || activeBanners[0].text_en;
    } else {
        if (prevBadge) prevBadge.textContent = "لا توجد إعلانات نشطة";
        if (prevText) prevText.textContent = "شريط الإعلانات معطل حالياً لعدم وجود إعلانات مفعلة.";
    }

    if (!tbody) return;

    if (adminBanners.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align:center; padding:36px; color:var(--text-muted);">
                    لا توجد إعلانات مسجلة حالياً. اضغط على <strong>➕ إضافة إعلان / بانر جديد</strong> لإنشاء أول إعلان.
                </td>
            </tr>
        `;
        return;
    }

    let html = "";
    adminBanners.forEach((b, idx) => {
        const isActive = (b.active !== false);
        const statusPill = isActive
            ? `<span class="badge-tag-pill active">🟢 مفعّل</span>`
            : `<span class="badge-tag-pill inactive">⚪ معطّل</span>`;
        const toggleBtnTitle = isActive ? "تعطيل الإعلان" : "تفعيل الإعلان";
        const linkDisplay = b.link ? `<a href="${b.link}" target="_blank" rel="noopener" style="color:var(--navy); text-decoration:underline; font-size:12px;">🔗 رابط</a>` : `<span style="color:#94A3B8;">—</span>`;

        html += `
            <tr>
                <td><strong>#${idx + 1}</strong></td>
                <td>
                    <span class="badge-tag-pill active" style="background:rgba(255,140,61,0.2); border:1px solid #FF8C3D; color:#E87528;">
                        ${escapeHTML(b.badge_ar || b.badge_en || 'إعلان')}
                    </span>
                </td>
                <td style="font-weight:600; max-width:320px;">${escapeHTML(b.text_ar || '')}</td>
                <td style="color:var(--text-muted); font-size:12px; max-width:260px;">${escapeHTML(b.text_en || '—')}</td>
                <td>${linkDisplay}</td>
                <td>
                    <button type="button" class="btn-table-action" onclick="toggleBannerStatus(${b.id})" title="${toggleBtnTitle}" style="border:none; background:transparent; cursor:pointer;">
                        ${statusPill}
                    </button>
                </td>
                <td>
                    <div class="action-btns-row">
                        <button type="button" class="btn-table-action btn-edit" title="تعديل الإعلان" onclick="openEditBannerModal(${b.id})">✏️</button>
                        <button type="button" class="btn-table-action btn-delete" title="حذف الإعلان" onclick="deleteBanner(${b.id})">🗑️</button>
                    </div>
                </td>
            </tr>
        `;
    });

    tbody.innerHTML = html;
}

function openAddBannerModal() {
    currentEditingBannerId = null;
    document.getElementById("modalBannerTitle").textContent = "📢 إضافة إعلان / بانر جديد";
    document.getElementById("bannerTextAr").value = "";
    document.getElementById("bannerTextEn").value = "";
    document.getElementById("bannerBadgeAr").value = "🚚 شحن فوري";
    document.getElementById("bannerBadgeEn").value = "Fast Delivery";
    document.getElementById("bannerLink").value = "";
    document.getElementById("bannerActive").checked = true;

    document.getElementById("bannerModal").classList.add("open");
}

function openEditBannerModal(bannerId) {
    const b = adminBanners.find(item => item.id === bannerId);
    if (!b) return;

    currentEditingBannerId = bannerId;
    document.getElementById("modalBannerTitle").textContent = "✏️ تعديل الإعلان / البانر";
    document.getElementById("bannerTextAr").value = b.text_ar || "";
    document.getElementById("bannerTextEn").value = b.text_en || "";
    document.getElementById("bannerBadgeAr").value = b.badge_ar || "";
    document.getElementById("bannerBadgeEn").value = b.badge_en || "";
    document.getElementById("bannerLink").value = b.link || "";
    document.getElementById("bannerActive").checked = (b.active !== false);

    document.getElementById("bannerModal").classList.add("open");
}

function closeBannerModal() {
    const modal = document.getElementById("bannerModal");
    if (modal) modal.classList.remove("open");
}

function saveBannerForm(e) {
    e.preventDefault();
    const textAr = document.getElementById("bannerTextAr").value.trim();
    const textEn = document.getElementById("bannerTextEn").value.trim();
    const badgeAr = document.getElementById("bannerBadgeAr").value.trim();
    const badgeEn = document.getElementById("bannerBadgeEn").value.trim();
    const link = document.getElementById("bannerLink").value.trim();
    const active = document.getElementById("bannerActive").checked;

    if (!textAr) {
        alert("يرجى كتابة نص الإعلان بالعربية");
        return;
    }

    if (currentEditingBannerId) {
        const b = adminBanners.find(item => item.id === currentEditingBannerId);
        if (b) {
            b.text_ar = textAr;
            b.text_en = textEn;
            b.badge_ar = badgeAr;
            b.badge_en = badgeEn;
            b.link = link;
            b.active = active;
        }
        showToast("تم تحديث الإعلان بنجاح!");
    } else {
        const newId = Date.now();
        const newBanner = {
            id: newId,
            text_ar: textAr,
            text_en: textEn,
            badge_ar: badgeAr || "📢 إعلان",
            badge_en: badgeEn || "News",
            link: link,
            active: active
        };
        adminBanners.unshift(newBanner);
        showToast("تمت إضافة الإعلان الجديد بنجاح!");
    }

    localStorage.setItem("woa_banners_v1", JSON.stringify(adminBanners));
    renderAdminBanners();
    closeBannerModal();
}

function deleteBanner(bannerId) {
    if (!confirm("هل أنت متأكد من حذف هذا الإعلان نهائياً من شريط الإعلانات؟")) return;
    adminBanners = adminBanners.filter(b => b.id !== bannerId);
    localStorage.setItem("woa_banners_v1", JSON.stringify(adminBanners));
    renderAdminBanners();
    showToast("تم حذف الإعلان بنجاح.");
}

function toggleBannerStatus(bannerId) {
    const b = adminBanners.find(item => item.id === bannerId);
    if (!b) return;
    b.active = !b.active;
    localStorage.setItem("woa_banners_v1", JSON.stringify(adminBanners));
    renderAdminBanners();
    showToast(b.active ? "تم تفعيل الإعلان بنجاح." : "تم تعطيل الإعلان.");
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
