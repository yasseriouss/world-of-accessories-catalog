/**
 * World of Accessories - Dashboard CMS
 * Image picker, categories, banners, landing/site content and media library.
 * Depends on supabase_sync.js and the helpers in admin.js (escapeHTML, showToast, requireAdmin).
 */

// ===================== Image picker =====================
const ImagePicker = {
    instances: {},

    mount(id, folder) {
        const root = document.getElementById(id);
        if (!root) return;
        root.classList.add("img-picker");
        root.innerHTML = `
            <div class="ip-drop" tabindex="0" role="button" aria-label="اختيار صورة">
                <img class="ip-preview" alt="" hidden>
                <div class="ip-hint">
                    <span class="ip-hint-icon">📷</span>
                    <strong>اسحب الصورة هنا أو اضغط للاختيار</strong>
                    <small>JPG · PNG · WEBP · تُصغَّر وتُضغط تلقائياً قبل الرفع</small>
                </div>
            </div>
            <input type="file" class="ip-file" accept="image/jpeg,image/png,image/webp,image/gif" hidden>
            <div class="ip-progress" hidden><div class="ip-bar"></div></div>
            <div class="ip-status" role="status" aria-live="polite"></div>
            <div class="ip-actions">
                <button type="button" class="btn-admin-action ip-library">🖼️ من مكتبة الوسائط</button>
                <button type="button" class="btn-admin-action ip-clear" hidden>🗑️ إزالة</button>
            </div>`;
        const inst = { root, folder: folder || "misc", value: "", busy: false };
        this.instances[id] = inst;

        const drop = root.querySelector(".ip-drop");
        const file = root.querySelector(".ip-file");
        drop.addEventListener("click", () => !inst.busy && file.click());
        drop.addEventListener("keydown", e => {
            if (e.key === "Enter" || e.key === " ") { e.preventDefault(); file.click(); }
        });
        file.addEventListener("change", () => file.files[0] && this.upload(id, file.files[0]).finally(() => { file.value = ""; }));
        ["dragenter", "dragover"].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.add("drag"); }));
        ["dragleave", "drop"].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.remove("drag"); }));
        drop.addEventListener("drop", e => {
            const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
            if (f) this.upload(id, f);
        });
        drop.addEventListener("paste", e => {
            const item = [...(e.clipboardData ? e.clipboardData.items : [])].find(i => i.type.startsWith("image/"));
            if (item) { e.preventDefault(); this.upload(id, item.getAsFile()); }
        });
        root.querySelector(".ip-clear").addEventListener("click", () => this.set(id, ""));
        root.querySelector(".ip-library").addEventListener("click", () => MediaPicker.open(url => this.set(id, url)));
        this.set(id, "");
    },

    get(id) {
        return this.instances[id] ? this.instances[id].value : "";
    },

    set(id, url) {
        const inst = this.instances[id];
        if (!inst) return;
        inst.value = url || "";
        const img = inst.root.querySelector(".ip-preview");
        const hint = inst.root.querySelector(".ip-hint");
        const has = !!inst.value;
        const isDefault = /^Branding\//.test(inst.value);
        if (has) img.src = /^https:\/\//i.test(inst.value) ? inst.value : "/" + inst.value.replace(/^\/+/, "");
        img.hidden = !has;
        hint.hidden = has;
        inst.root.querySelector(".ip-clear").hidden = !has || isDefault;
        this.status(id, "", "");
    },

    status(id, msg, kind) {
        const el = this.instances[id] && this.instances[id].root.querySelector(".ip-status");
        if (!el) return;
        el.textContent = msg;
        el.className = "ip-status" + (kind ? " " + kind : "");
    },

    async upload(id, file) {
        const inst = this.instances[id];
        if (!inst || inst.busy) return;
        if (!requireAdmin()) return;
        const bar = inst.root.querySelector(".ip-bar");
        const prog = inst.root.querySelector(".ip-progress");
        inst.busy = true;
        inst.root.classList.add("busy");
        prog.hidden = false;
        bar.style.width = "4%";
        this.status(id, "جاري معالجة الصورة ورفعها...", "");
        try {
            const r = await window.SupabaseSync.uploadImage(file, inst.folder, p => { bar.style.width = Math.max(4, Math.round(p * 100)) + "%"; });
            this.set(id, r.url);
            const kb = n => Math.round(n / 1024) + "KB";
            this.status(id, `تم الرفع بنجاح (${kb(r.before)} ← ${kb(r.after)})`, "ok");
            showToast("تم رفع الصورة بنجاح");
        } catch (err) {
            this.status(id, err.message, "err");
            checkAdminAuth();
        } finally {
            inst.busy = false;
            inst.root.classList.remove("busy");
            setTimeout(() => { prog.hidden = true; bar.style.width = "0"; }, 600);
        }
    }
};

// ===================== Media library =====================
let mediaCache = [];

function formatBytes(n) {
    if (!n) return "—";
    return n > 1048576 ? (n / 1048576).toFixed(1) + " MB" : Math.round(n / 1024) + " KB";
}

async function loadMedia(force) {
    const grid = document.getElementById("mediaGrid");
    if (!grid) return;
    if (!window.SupabaseAuth.isLoggedIn()) {
        grid.innerHTML = `<div class="media-empty">سجّل الدخول لعرض مكتبة الوسائط.</div>`;
        return;
    }
    if (!force && mediaCache.length) { renderMedia(); return; }
    grid.innerHTML = `<div class="media-empty">جاري التحميل...</div>`;
    try {
        mediaCache = await window.SupabaseSync.listMedia();
        renderMedia();
    } catch (err) {
        grid.innerHTML = `<div class="media-empty err">${escapeHTML(err.message)}</div>`;
    }
}

function mediaCardHTML(m, picker) {
    const open = picker ? `onclick="MediaPicker.choose('${escapeHTML(m.url)}')"` : "";
    return `
        <div class="media-card" ${open}>
            <div class="media-thumb"><img src="${escapeHTML(m.url)}" alt="" loading="lazy"></div>
            <div class="media-meta">
                <span class="media-name" title="${escapeHTML(m.path)}">${escapeHTML(m.path)}</span>
                <span class="media-size">${formatBytes(m.size)}</span>
            </div>
            ${picker ? "" : `
            <div class="media-actions">
                <button type="button" class="btn-table-action" title="نسخ الرابط" onclick="copyMediaUrl('${escapeHTML(m.url)}')">📋</button>
                <button type="button" class="btn-table-action btn-delete" title="حذف" onclick="deleteMediaItem('${escapeHTML(m.path)}')">🗑️</button>
            </div>`}
        </div>`;
}

function renderMedia() {
    const grid = document.getElementById("mediaGrid");
    const count = document.getElementById("tabBadgeMedia");
    if (count) count.textContent = mediaCache.length;
    if (!grid) return;
    grid.innerHTML = mediaCache.length
        ? mediaCache.map(m => mediaCardHTML(m, false)).join("")
        : `<div class="media-empty">لا توجد صور بعد. ارفع أول صورة من الأعلى.</div>`;
}

async function uploadMediaFiles(files) {
    if (!requireAdmin()) return;
    const list = [...files];
    if (!list.length) return;
    const status = document.getElementById("mediaUploadStatus");
    let ok = 0;
    for (let i = 0; i < list.length; i++) {
        status.textContent = `رفع ${i + 1} من ${list.length}: ${list[i].name}`;
        try {
            await window.SupabaseSync.uploadImage(list[i], "media");
            ok++;
        } catch (err) {
            status.textContent = `${list[i].name}: ${err.message}`;
            await new Promise(r => setTimeout(r, 1500));
        }
    }
    status.textContent = `تم رفع ${ok} من ${list.length} صورة`;
    showToast(`تم رفع ${ok} صورة`);
    loadMedia(true);
}

function copyMediaUrl(url) {
    navigator.clipboard.writeText(url).then(() => showToast("تم نسخ رابط الصورة"), () => prompt("انسخ الرابط:", url));
}

async function deleteMediaItem(path) {
    if (!requireAdmin()) return;
    if (!confirm("حذف هذه الصورة نهائياً؟ إذا كانت مستخدمة في منتج فستظهر صورة بديلة.")) return;
    try {
        await window.SupabaseSync.deleteMedia([path]);
        mediaCache = mediaCache.filter(m => m.path !== path);
        renderMedia();
        showToast("تم حذف الصورة");
    } catch (err) {
        alert(err.message);
    }
}

function setupMediaDropzone() {
    const zone = document.getElementById("mediaDropzone");
    const input = document.getElementById("mediaFileInput");
    if (!zone || !input) return;
    zone.addEventListener("click", () => input.click());
    input.addEventListener("change", () => { uploadMediaFiles(input.files); input.value = ""; });
    ["dragenter", "dragover"].forEach(ev => zone.addEventListener(ev, e => { e.preventDefault(); zone.classList.add("drag"); }));
    ["dragleave", "drop"].forEach(ev => zone.addEventListener(ev, e => { e.preventDefault(); zone.classList.remove("drag"); }));
    zone.addEventListener("drop", e => uploadMediaFiles(e.dataTransfer.files));
}

const MediaPicker = {
    callback: null,
    async open(cb) {
        if (!requireAdmin()) return;
        this.callback = cb;
        const modal = document.getElementById("mediaPickerModal");
        const grid = document.getElementById("mediaPickerGrid");
        modal.classList.add("open");
        grid.innerHTML = `<div class="media-empty">جاري التحميل...</div>`;
        try {
            if (!mediaCache.length) mediaCache = await window.SupabaseSync.listMedia();
            grid.innerHTML = mediaCache.length
                ? mediaCache.map(m => mediaCardHTML(m, true)).join("")
                : `<div class="media-empty">لا توجد صور في المكتبة بعد.</div>`;
        } catch (err) {
            grid.innerHTML = `<div class="media-empty err">${escapeHTML(err.message)}</div>`;
        }
    },
    choose(url) {
        if (this.callback) this.callback(url);
        this.close();
    },
    close() {
        document.getElementById("mediaPickerModal").classList.remove("open");
        this.callback = null;
    }
};

// ===================== Categories =====================
let adminCategoriesFull = [];
let editingCategoryId = null;

const CATEGORY_ICONS = [
    ["📦", "صندوق"], ["🔧", "مفتاح ربط"], ["🚪", "باب"], ["💪", "ذراع"], ["🔩", "صامولة"], ["✨", "لمعة"],
    ["🍽", "مطبخ"], ["🔐", "قفل"], ["🛠", "أدوات"], ["💡", "إضاءة"], ["🏷", "وسم"], ["📐", "مسطرة"],
    ["🎨", "ألوان"], ["🛋", "أثاث"], ["👔", "ملابس"], ["🍳", "طبخ"], ["🚚", "شحن"], ["🛒", "سلة"]
];

async function loadAdminCategories() {
    try {
        adminCategoriesFull = await window.SupabaseSync.select("woa_categories", "select=*&order=id.asc");
    } catch (e) {
        adminCategoriesFull = [];
    }
    renderAdminCategories();
}

function productCountFor(catId) {
    return (window.__allProducts || []).filter(p => p.category_id === catId).length;
}

function renderAdminCategories() {
    const tbody = document.getElementById("adminCategoriesTableBody");
    const badge = document.getElementById("tabBadgeCategories");
    if (badge) badge.textContent = adminCategoriesFull.length;
    if (!tbody) return;
    if (!adminCategoriesFull.length) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:30px; color:var(--text-muted);">لا توجد فئات.</td></tr>`;
        return;
    }
    tbody.innerHTML = adminCategoriesFull.map(c => `
        <tr>
            <td><span class="sku-badge">#${Number(c.id)}</span></td>
            <td style="font-size:20px;">${escapeHTML(c.icon || "📦")}</td>
            <td><strong>${escapeHTML(c.ar)}</strong></td>
            <td style="color:var(--text-muted); font-size:12px;">${escapeHTML(c.en)}</td>
            <td><span class="cat-badge-sm">${productCountFor(c.id)} منتج</span></td>
            <td>
                <div class="actions-cell">
                    <button type="button" class="btn-table-icon" title="تعديل" onclick="openEditCategoryModal(${Number(c.id)})">✏️</button>
                    <button type="button" class="btn-table-icon btn-delete" title="حذف" onclick="deleteCategoryConfirm(${Number(c.id)})">🗑️</button>
                </div>
            </td>
        </tr>`).join("");
}

function fillIconSelect(selected) {
    const sel = document.getElementById("catIcon");
    const list = CATEGORY_ICONS.slice();
    if (selected && !list.some(i => i[0] === selected)) list.unshift([selected, "الحالي"]);
    sel.innerHTML = list.map(([e, l]) => `<option value="${escapeHTML(e)}" ${e === selected ? "selected" : ""}>${escapeHTML(e)} ${escapeHTML(l)}</option>`).join("");
}

function openAddCategoryModal() {
    editingCategoryId = null;
    document.getElementById("modalCategoryTitle").textContent = "➕ إضافة فئة جديدة";
    document.getElementById("catAr").value = "";
    document.getElementById("catEn").value = "";
    document.getElementById("catSlug").value = "";
    fillIconSelect("📦");
    document.getElementById("categoryModal").classList.add("open");
}

function openEditCategoryModal(id) {
    const c = adminCategoriesFull.find(x => x.id === id);
    if (!c) return;
    editingCategoryId = id;
    document.getElementById("modalCategoryTitle").textContent = "✏️ تعديل الفئة";
    document.getElementById("catAr").value = c.ar || "";
    document.getElementById("catEn").value = c.en || "";
    document.getElementById("catSlug").value = c.slug || "";
    fillIconSelect(c.icon || "📦");
    document.getElementById("categoryModal").classList.add("open");
}

function closeCategoryModal() {
    document.getElementById("categoryModal").classList.remove("open");
}

async function saveCategoryForm(e) {
    e.preventDefault();
    if (!requireAdmin()) return;
    const row = {
        ar: document.getElementById("catAr").value.trim(),
        en: document.getElementById("catEn").value.trim(),
        icon: document.getElementById("catIcon").value || "📦",
        slug: document.getElementById("catSlug").value.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "-") || null
    };
    if (!row.ar || !row.en) { alert("يرجى إدخال اسم الفئة بالعربية والإنجليزية"); return; }
    try {
        if (editingCategoryId) await window.SupabaseSync.updateCategory(editingCategoryId, row);
        else await window.SupabaseSync.insertCategory(row);
        closeCategoryModal();
        showToast("تم حفظ الفئة وتحديث المتجر");
        await loadAdminCategories();
        loadCategories();
    } catch (err) {
        alert("فشل حفظ الفئة: " + err.message);
        checkAdminAuth();
    }
}

async function deleteCategoryConfirm(id) {
    if (!requireAdmin()) return;
    const n = productCountFor(id);
    if (n > 0) {
        alert(`لا يمكن حذف هذه الفئة لأنها تحتوي على ${n} منتج. انقل المنتجات إلى فئة أخرى أولاً.`);
        return;
    }
    if (!confirm("حذف هذه الفئة نهائياً؟")) return;
    try {
        await window.SupabaseSync.deleteCategory(id);
        showToast("تم حذف الفئة");
        await loadAdminCategories();
        loadCategories();
    } catch (err) {
        alert("فشل الحذف: " + err.message);
    }
}

// ===================== Banners (Supabase) =====================
let adminBanners = [];
let currentEditingBannerId = null;

async function loadAdminBanners() {
    try {
        adminBanners = await window.SupabaseSync.fetchBanners();
    } catch (e) {
        adminBanners = [];
    }
    renderAdminBanners();
}

function safeLink(url) {
    return /^(https?:\/\/|tel:|#|\/)/i.test(url || "") ? url : "";
}

function renderAdminBanners() {
    const tbody = document.getElementById("adminBannersTableBody");
    const badge = document.getElementById("tabBadgeBanners");
    if (badge) badge.textContent = adminBanners.length;
    const statActive = document.getElementById("statBannersCount");
    const active = adminBanners.filter(b => b.active);
    if (statActive) statActive.textContent = active.length;

    const prevBadge = document.getElementById("bannerPrevBadge");
    const prevText = document.getElementById("bannerPrevText");
    if (active.length) {
        if (prevBadge) prevBadge.textContent = active[0].badge_ar || active[0].badge_en || "إعلان";
        if (prevText) prevText.textContent = active[0].text_ar || active[0].text_en;
    } else {
        if (prevBadge) prevBadge.textContent = "لا توجد إعلانات نشطة";
        if (prevText) prevText.textContent = "شريط الإعلانات معطل حالياً.";
    }
    if (!tbody) return;
    if (!adminBanners.length) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:36px; color:var(--text-muted);">لا توجد إعلانات. اضغط <strong>➕ إضافة إعلان</strong>.</td></tr>`;
        return;
    }
    tbody.innerHTML = adminBanners.map((b, idx) => {
        const link = safeLink(b.link);
        return `
        <tr>
            <td>
                <div class="actions-cell">
                    <button type="button" class="btn-table-icon" title="أعلى" ${idx === 0 ? "disabled" : ""} onclick="moveBanner(${Number(b.id)}, -1)">▲</button>
                    <button type="button" class="btn-table-icon" title="أسفل" ${idx === adminBanners.length - 1 ? "disabled" : ""} onclick="moveBanner(${Number(b.id)}, 1)">▼</button>
                </div>
            </td>
            <td><span class="badge-tag-pill active">${escapeHTML(b.badge_ar || b.badge_en || "إعلان")}</span></td>
            <td style="font-weight:600; max-width:320px;">${escapeHTML(b.text_ar)}</td>
            <td style="color:var(--text-muted); font-size:12px; max-width:260px;">${escapeHTML(b.text_en || "—")}</td>
            <td>${link ? `<a href="${escapeHTML(link)}" target="_blank" rel="noopener" style="color:var(--navy); text-decoration:underline; font-size:12px;">🔗 رابط</a>` : `<span style="color:#94A3B8;">—</span>`}</td>
            <td>
                <button type="button" class="btn-table-action" onclick="toggleBannerStatus(${Number(b.id)})" title="${b.active ? "تعطيل" : "تفعيل"}" style="border:none; background:transparent; cursor:pointer;">
                    <span class="badge-tag-pill ${b.active ? "active" : "inactive"}">${b.active ? "🟢 مفعّل" : "⚪ معطّل"}</span>
                </button>
            </td>
            <td>
                <div class="actions-cell">
                    <button type="button" class="btn-table-icon" title="تعديل" onclick="openEditBannerModal(${Number(b.id)})">✏️</button>
                    <button type="button" class="btn-table-icon btn-delete" title="حذف" onclick="deleteBanner(${Number(b.id)})">🗑️</button>
                </div>
            </td>
        </tr>`;
    }).join("");
}

function openAddBannerModal() {
    currentEditingBannerId = null;
    document.getElementById("modalBannerTitle").textContent = "📢 إضافة إعلان جديد";
    document.getElementById("bannerTextAr").value = "";
    document.getElementById("bannerTextEn").value = "";
    document.getElementById("bannerBadgeAr").value = "";
    document.getElementById("bannerBadgeEn").value = "";
    document.getElementById("bannerLink").value = "";
    document.getElementById("bannerActive").checked = true;
    document.getElementById("bannerModal").classList.add("open");
}

function openEditBannerModal(id) {
    const b = adminBanners.find(x => x.id === id);
    if (!b) return;
    currentEditingBannerId = id;
    document.getElementById("modalBannerTitle").textContent = "✏️ تعديل الإعلان";
    document.getElementById("bannerTextAr").value = b.text_ar || "";
    document.getElementById("bannerTextEn").value = b.text_en || "";
    document.getElementById("bannerBadgeAr").value = b.badge_ar || "";
    document.getElementById("bannerBadgeEn").value = b.badge_en || "";
    document.getElementById("bannerLink").value = b.link || "";
    document.getElementById("bannerActive").checked = !!b.active;
    document.getElementById("bannerModal").classList.add("open");
}

function closeBannerModal() {
    document.getElementById("bannerModal").classList.remove("open");
}

async function saveBannerForm(e) {
    e.preventDefault();
    if (!requireAdmin()) return;
    const link = document.getElementById("bannerLink").value.trim();
    const row = {
        text_ar: document.getElementById("bannerTextAr").value.trim(),
        text_en: document.getElementById("bannerTextEn").value.trim(),
        badge_ar: document.getElementById("bannerBadgeAr").value.trim(),
        badge_en: document.getElementById("bannerBadgeEn").value.trim(),
        link,
        active: document.getElementById("bannerActive").checked
    };
    if (!row.text_ar) { alert("يرجى كتابة نص الإعلان بالعربية"); return; }
    if (link && !safeLink(link)) { alert("الرابط يجب أن يبدأ بـ https:// أو tel: أو #"); return; }
    try {
        if (currentEditingBannerId) {
            await window.SupabaseSync.updateBanner(currentEditingBannerId, row);
        } else {
            row.sort_order = adminBanners.reduce((m, b) => Math.max(m, b.sort_order || 0), 0) + 1;
            await window.SupabaseSync.insertBanner(row);
        }
        closeBannerModal();
        showToast("تم حفظ الإعلان وتحديث المتجر");
        loadAdminBanners();
    } catch (err) {
        alert("فشل الحفظ: " + err.message);
        checkAdminAuth();
    }
}

async function deleteBanner(id) {
    if (!requireAdmin()) return;
    if (!confirm("حذف هذا الإعلان نهائياً؟")) return;
    try {
        await window.SupabaseSync.deleteBanner(id);
        showToast("تم حذف الإعلان");
        loadAdminBanners();
    } catch (err) {
        alert("فشل الحذف: " + err.message);
    }
}

async function toggleBannerStatus(id) {
    if (!requireAdmin()) return;
    const b = adminBanners.find(x => x.id === id);
    if (!b) return;
    try {
        await window.SupabaseSync.updateBanner(id, { active: !b.active });
        loadAdminBanners();
    } catch (err) {
        alert("فشل التحديث: " + err.message);
    }
}

async function moveBanner(id, dir) {
    if (!requireAdmin()) return;
    const i = adminBanners.findIndex(b => b.id === id);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= adminBanners.length) return;
    const a = adminBanners[i], b = adminBanners[j];
    const sa = a.sort_order, sb = b.sort_order === sa ? sa + dir : b.sort_order;
    try {
        await Promise.all([
            window.SupabaseSync.updateBanner(a.id, { sort_order: sb }),
            window.SupabaseSync.updateBanner(b.id, { sort_order: sa })
        ]);
        loadAdminBanners();
    } catch (err) {
        alert("فشل إعادة الترتيب: " + err.message);
    }
}

// ===================== Landing & site content =====================
const LANDING_FIELDS = ["hero_title_ar", "hero_title_en", "hero_subtitle_ar", "hero_subtitle_en", "cta_text_ar", "cta_text_en"];
const SITE_FIELDS = ["phone", "whatsapp", "address_ar", "address_en", "hours_ar", "hours_en", "instagram", "facebook", "tiktok", "maps"];
const URL_FIELDS = ["instagram", "facebook", "tiktok", "maps"];
let contentSettings = { landing: {}, site: {} };

function extraRowHTML(k, v) {
    return `
        <div class="extra-row">
            <input type="text" class="form-input extra-key" placeholder="المفتاح (مثال: promo_title_ar)" value="${escapeHTML(k)}" dir="ltr">
            <input type="text" class="form-input extra-val" placeholder="القيمة" value="${escapeHTML(v)}">
            <button type="button" class="btn-table-icon btn-delete" title="حذف" onclick="this.parentElement.remove()">🗑️</button>
        </div>`;
}

function addExtraField(k = "", v = "") {
    document.getElementById("extraFields").insertAdjacentHTML("beforeend", extraRowHTML(k, v));
}

async function loadContentSettings() {
    try {
        const all = await window.SupabaseSync.fetchSettings();
        contentSettings = { landing: all.landing || {}, site: all.site || {} };
    } catch (e) {
        contentSettings = { landing: {}, site: {} };
    }
    LANDING_FIELDS.forEach(k => { document.getElementById("set_" + k).value = contentSettings.landing[k] || ""; });
    SITE_FIELDS.forEach(k => { document.getElementById("set_" + k).value = contentSettings.site[k] || ""; });
    ImagePicker.set("heroImagePicker", contentSettings.landing.hero_image || "");
    const extras = document.getElementById("extraFields");
    extras.innerHTML = "";
    Object.keys(contentSettings.landing).filter(k => !LANDING_FIELDS.includes(k) && k !== "hero_image").forEach(k => {
        addExtraField(k, String(contentSettings.landing[k]));
    });
}

async function saveContentForm(e) {
    e.preventDefault();
    if (!requireAdmin()) return;
    const landing = { ...contentSettings.landing };
    const site = { ...contentSettings.site };
    LANDING_FIELDS.forEach(k => { landing[k] = document.getElementById("set_" + k).value.trim(); });
    SITE_FIELDS.forEach(k => { site[k] = document.getElementById("set_" + k).value.trim(); });
    landing.hero_image = ImagePicker.get("heroImagePicker");

    for (const k of URL_FIELDS) {
        if (site[k] && !/^https:\/\//i.test(site[k])) { alert("الرابط يجب أن يبدأ بـ https:// : " + k); return; }
    }
    if (site.whatsapp && !/^\d{8,15}$/.test(site.whatsapp)) { alert("رقم واتساب يجب أن يكون أرقاماً فقط بصيغة دولية (مثال: 201140030036)"); return; }

    const keep = new Set([...LANDING_FIELDS, "hero_image"]);
    Object.keys(landing).forEach(k => { if (!keep.has(k)) delete landing[k]; });
    document.querySelectorAll("#extraFields .extra-row").forEach(row => {
        const k = row.querySelector(".extra-key").value.trim().replace(/[^a-zA-Z0-9_]/g, "_");
        if (k) landing[k] = row.querySelector(".extra-val").value.trim();
    });

    const btn = document.getElementById("saveContentBtn");
    btn.disabled = true;
    try {
        await window.SupabaseSync.saveSetting("landing", landing);
        await window.SupabaseSync.saveSetting("site", site);
        contentSettings = { landing, site };
        showToast("تم حفظ محتوى الموقع وتحديث صفحة الهبوط");
    } catch (err) {
        alert("فشل الحفظ: " + err.message);
        checkAdminAuth();
    } finally {
        btn.disabled = false;
    }
}

// ===================== Ratings =====================
let adminRatings = [];
let ratingsProductId = null;

function starsMarkup(avg) {
    const pct = Math.max(0, Math.min(100, (avg / 5) * 100));
    return `<span class="stars" role="img" aria-label="${Number(avg).toFixed(1)} / 5"><i style="width:${pct}%"></i></span>`;
}

async function loadAdminRatings() {
    if (!window.SupabaseAuth.isLoggedIn()) {
        document.getElementById("adminRatingsTableBody").innerHTML =
            `<tr><td colspan="6" style="text-align:center; padding:30px; color:var(--text-muted);">سجّل الدخول لإدارة التقييمات.</td></tr>`;
        return;
    }
    try {
        adminRatings = await window.SupabaseSync.fetchRatings();
    } catch (err) {
        adminRatings = [];
        document.getElementById("adminRatingsTableBody").innerHTML =
            `<tr><td colspan="6" style="text-align:center; padding:30px; color:#DC2626;">${escapeHTML(err.message)}</td></tr>`;
        return;
    }
    renderRatingsTable();
}

function ratingStatsFor(productId) {
    const list = adminRatings.filter(r => r.product_id === productId);
    const visible = list.filter(r => r.approved);
    const avg = visible.length ? visible.reduce((s, r) => s + r.rating, 0) / visible.length : 0;
    return { total: list.length, visible: visible.length, hidden: list.length - visible.length, avg };
}

function renderRatingsTable() {
    const tbody = document.getElementById("adminRatingsTableBody");
    if (!tbody) return;
    const badge = document.getElementById("tabBadgeRatings");
    if (badge) badge.textContent = adminRatings.length;

    const q = (document.getElementById("ratingsSearch").value || "").trim().toLowerCase();
    const mode = document.getElementById("ratingsFilter").value;
    const products = window.__allProducts || [];

    let rows = products.map(p => ({ p, st: ratingStatsFor(p.id) }));
    if (mode === "rated") rows = rows.filter(r => r.st.total > 0);
    if (mode === "hidden") rows = rows.filter(r => r.st.hidden > 0);
    if (q) {
        rows = rows.filter(r => (r.p.ar || "").toLowerCase().includes(q) || (r.p.en || "").toLowerCase().includes(q) ||
            `woa-${String(r.p.id).padStart(4, "0")}`.includes(q) || String(r.p.id) === q);
    }
    rows.sort((a, b) => b.st.total - a.st.total || a.p.id - b.p.id);

    if (!rows.length) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:30px; color:var(--text-muted);">لا توجد نتائج. التقييمات تظهر هنا عندما يقيّم العملاء المنتجات من المتجر.</td></tr>`;
        return;
    }
    tbody.innerHTML = rows.slice(0, 300).map(({ p, st }) => `
        <tr>
            <td><span class="sku-badge">WOA-${String(p.id).padStart(4, "0")}</span></td>
            <td><strong>${escapeHTML(p.ar || "-")}</strong><div style="font-size:12px; color:var(--text-muted);">${escapeHTML(p.en || "")}</div></td>
            <td><div style="display:flex; align-items:center; gap:8px;">${starsMarkup(st.avg)}<strong>${st.visible ? st.avg.toFixed(1) : "—"}</strong></div></td>
            <td>${st.visible}</td>
            <td>${st.hidden ? `<span class="badge-tag-pill inactive">${st.hidden}</span>` : "—"}</td>
            <td><button type="button" class="btn-admin-action" style="color:var(--navy); background:#E2E8F0;" onclick="openRatingsModal(${Number(p.id)})">إدارة</button></td>
        </tr>`).join("");
}

function openRatingsModal(productId) {
    ratingsProductId = productId;
    const p = (window.__allProducts || []).find(x => x.id === productId) || {};
    document.getElementById("ratingsModalTitle").textContent = `تقييمات: ${p.ar || "WOA-" + productId}`;
    renderRatingsModal();
    document.getElementById("ratingsModal").classList.add("open");
}

function closeRatingsModal() {
    document.getElementById("ratingsModal").classList.remove("open");
    ratingsProductId = null;
}

function renderRatingsModal() {
    const id = ratingsProductId;
    if (id === null) return;
    const st = ratingStatsFor(id);
    document.getElementById("ratingsModalSummary").innerHTML = st.visible
        ? `<div style="display:flex; align-items:center; gap:8px;">${starsMarkup(st.avg)}<strong>${st.avg.toFixed(1)}</strong><span style="color:var(--text-muted); font-size:12px;">(${st.visible} ظاهر${st.hidden ? " · " + st.hidden + " مخفي" : ""})</span></div>`
        : `<span style="color:var(--text-muted); font-size:12px;">لا توجد تقييمات ظاهرة</span>`;
    const list = adminRatings.filter(r => r.product_id === id);
    const fmt = d => new Date(d).toLocaleString("ar-EG", { dateStyle: "medium", timeStyle: "short" });
    document.getElementById("ratingsModalBody").innerHTML = list.length ? list.map(r => `
        <tr>
            <td>${starsMarkup(r.rating)} <strong>${r.rating}</strong>${String(r.client_id).startsWith("admin-") ? ' <small style="color:var(--text-muted);">(يدوي)</small>' : ""}</td>
            <td style="font-size:12px;">${escapeHTML(fmt(r.created_at))}</td>
            <td><button type="button" style="border:none; background:transparent; cursor:pointer;" onclick="toggleRatingVisibility(${Number(r.id)})" title="${r.approved ? "إخفاء" : "إظهار"}">
                <span class="badge-tag-pill ${r.approved ? "active" : "inactive"}">${r.approved ? "ظاهر" : "مخفي"}</span></button></td>
            <td><button type="button" class="btn-table-icon btn-delete" title="حذف" onclick="deleteRatingItem(${Number(r.id)})">🗑️</button></td>
        </tr>`).join("") : `<tr><td colspan="4" style="text-align:center; padding:20px; color:var(--text-muted);">لا توجد تقييمات</td></tr>`;
}

async function toggleRatingVisibility(id) {
    if (!requireAdmin()) return;
    const r = adminRatings.find(x => x.id === id);
    if (!r) return;
    try {
        await window.SupabaseSync.updateRating(id, { approved: !r.approved });
        r.approved = !r.approved;
        renderRatingsModal();
        renderRatingsTable();
        showToast(r.approved ? "تم إظهار التقييم" : "تم إخفاء التقييم");
    } catch (err) {
        alert("فشل التحديث: " + err.message);
    }
}

async function deleteRatingItem(id) {
    if (!requireAdmin()) return;
    if (!confirm("حذف هذا التقييم نهائياً؟")) return;
    try {
        await window.SupabaseSync.deleteRating(id);
        adminRatings = adminRatings.filter(r => r.id !== id);
        renderRatingsModal();
        renderRatingsTable();
        showToast("تم حذف التقييم");
    } catch (err) {
        alert("فشل الحذف: " + err.message);
    }
}

async function addManualRating() {
    if (!requireAdmin() || ratingsProductId === null) return;
    const value = Number(document.getElementById("manualRatingValue").value);
    const clientId = "admin-" + (crypto.randomUUID ? crypto.randomUUID() : Date.now() + "-" + Math.random().toString(36).slice(2, 10));
    try {
        const row = await window.SupabaseSync.insertRating({ product_id: ratingsProductId, rating: value, client_id: clientId, approved: true });
        adminRatings.unshift(row);
        renderRatingsModal();
        renderRatingsTable();
        showToast("تمت إضافة التقييم");
    } catch (err) {
        alert("فشل الإضافة: " + err.message);
    }
}

async function clearProductRatings() {
    if (!requireAdmin() || ratingsProductId === null) return;
    const n = adminRatings.filter(r => r.product_id === ratingsProductId).length;
    if (!n) return;
    if (!confirm(`حذف كل تقييمات هذا المنتج (${n}) نهائياً؟`)) return;
    try {
        await window.SupabaseSync.deleteRatingsForProduct(ratingsProductId);
        adminRatings = adminRatings.filter(r => r.product_id !== ratingsProductId);
        renderRatingsModal();
        renderRatingsTable();
        showToast("تم حذف كل التقييمات");
    } catch (err) {
        alert("فشل الحذف: " + err.message);
    }
}

// ===================== bootstrap =====================
document.addEventListener("DOMContentLoaded", () => {
    ImagePicker.mount("prodImagePicker", "products");
    ImagePicker.mount("heroImagePicker", "landing");
    setupMediaDropzone();
    loadAdminCategories();
    loadAdminBanners();
});
