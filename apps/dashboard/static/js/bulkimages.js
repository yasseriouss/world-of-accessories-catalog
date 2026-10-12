/**
 * World of Accessories - bulk image matcher.
 * Pick many image files named by product code (WOA-0123.jpg, prod_0123.webp, 123.png ...);
 * each one is resized to WebP, uploaded, and attached to the matching product.
 */
const BulkImages = (() => {
    const MAX_FILES = 1500;
    const CONCURRENCY = 3;
    const CHUNK = 50;
    const PRIMARY_VARIANTS = ["", "1", "main", "front", "a", "primary"];
    const NAME_RE = /^(?:woa|prod|product|item|sku|p)?[-_ ]*0*(\d{1,6})(?:[-_ ]+([a-z0-9]+))?$/;

    let state = null; // { items, products, overwrite, urls }

    function parseName(filename) {
        const base = filename.replace(/\.[^.]+$/, "").trim().toLowerCase();
        const m = base.match(NAME_RE);
        if (!m) return null;
        const id = Number(m[1]);
        return id > 0 ? { id, variant: m[2] || "" } : null;
    }

    const hasRealImage = p => /^https:\/\//i.test(p.image || "");

    function buildPlan(files, products, overwrite) {
        const byId = new Map(products.map(p => [p.id, p]));
        const sorted = [...files].sort((a, b) => a.name.localeCompare(b.name, "en", { numeric: true }));
        const items = [];
        const taken = new Set();

        sorted.forEach(file => {
            const item = { file, name: file.name, status: "ready", note: "", product: null };
            const parsed = parseName(file.name);
            if (!file.type.startsWith("image/")) {
                item.status = "bad";
                item.note = "ليس ملف صورة";
            } else if (!parsed) {
                item.status = "bad";
                item.note = "اسم الملف لا يحتوي على كود منتج";
            } else if (!PRIMARY_VARIANTS.includes(parsed.variant)) {
                item.status = "secondary";
                item.note = "صورة إضافية (يُستخدم صورة واحدة لكل منتج)";
                item.product = byId.get(parsed.id) || null;
            } else if (!byId.has(parsed.id)) {
                item.status = "unknown";
                item.note = `لا يوجد منتج بالكود ${parsed.id}`;
            } else {
                item.product = byId.get(parsed.id);
                if (taken.has(parsed.id)) {
                    item.status = "duplicate";
                    item.note = "صورة أخرى لنفس المنتج في المجموعة";
                } else if (hasRealImage(item.product) && !overwrite) {
                    item.status = "has-image";
                    item.note = "للمنتج صورة حالية (فعّل الاستبدال لتغييرها)";
                } else {
                    taken.add(parsed.id);
                }
            }
            items.push(item);
        });
        return items;
    }

    function summarize(items, products) {
        const count = s => items.filter(i => i.status === s).length;
        const ready = items.filter(i => i.status === "ready");
        const covered = new Set(ready.map(i => i.product.id));
        const missingAfter = products.filter(p => !hasRealImage(p) && !covered.has(p.id)).length;
        return {
            total: items.length,
            ready: ready.length,
            hasImage: count("has-image"),
            skipped: count("secondary") + count("duplicate"),
            bad: count("bad") + count("unknown"),
            missingAfter
        };
    }

    async function pool(list, limit, worker) {
        let next = 0;
        const run = async () => {
            while (next < list.length) {
                const i = next++;
                await worker(list[i], i);
            }
        };
        await Promise.all(Array.from({ length: Math.min(limit, list.length) }, run));
    }

    async function apply(onProgress) {
        const ready = state.items.filter(i => i.status === "ready");
        const uploaded = [];
        const failed = [];
        let done = 0;

        await pool(ready, CONCURRENCY, async item => {
            try {
                const r = await window.SupabaseSync.uploadImage(item.file, "products");
                uploaded.push({ product: item.product, url: r.url });
            } catch (err) {
                failed.push({ name: item.name, error: err.message });
            }
            done++;
            onProgress(done, ready.length);
        });

        // write the new image urls back in chunks (upsert by id with the full row)
        for (let i = 0; i < uploaded.length; i += CHUNK) {
            const rows = uploaded.slice(i, i + CHUNK).map(u => ({
                id: u.product.id,
                ar: u.product.ar,
                en: u.product.en,
                price: u.product.price,
                category_id: u.product.category_id,
                usage_type: u.product.usage_type,
                usage_ar: u.product.usage_ar,
                usage_en: u.product.usage_en,
                image: u.url
            }));
            const res = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/woa_products?on_conflict=id`, {
                method: "POST",
                headers: await window.SupabaseSync.writeHeaders({ Prefer: "return=minimal,resolution=merge-duplicates" }),
                body: JSON.stringify(rows)
            });
            await window.SupabaseSync.check(res, "فشل ربط الصور بالمنتجات");
        }
        try { sessionStorage.removeItem("woa_cache_products"); } catch (e) {}
        return { attached: uploaded.length, failed };
    }

    return { buildPlan, summarize, apply, hasRealImage, set: s => { state = s; }, get: () => state };
})();

// ===================== UI =====================
function openBulkImagesModal() {
    if (!requireAdmin()) return;
    BulkImages.set(null);
    document.getElementById("bulkBody").innerHTML = `
        <div class="bulk-drop" id="bulkDrop" tabindex="0" role="button">
            <span style="font-size:30px;">🖼️</span>
            <strong>اسحب مجلد الصور هنا أو اضغط لاختيار الملفات</strong>
            <small>سمِّ كل صورة بكود المنتج: <code dir="ltr">WOA-0123.jpg</code> أو <code dir="ltr">0123.webp</code> أو <code dir="ltr">prod_0123.png</code></small>
        </div>
        <input type="file" id="bulkFileInput" accept="image/jpeg,image/png,image/webp,image/gif" multiple hidden>
        <div class="bulk-actions-row">
            <button type="button" class="btn-admin-action excel-btn" id="bulkFolderBtn">📁 اختيار مجلد</button>
            <button type="button" class="btn-admin-action excel-btn" onclick="downloadMissingImagesList()">📋 قائمة المنتجات بلا صور</button>
        </div>`;
    const drop = document.getElementById("bulkDrop");
    const input = document.getElementById("bulkFileInput");
    drop.addEventListener("click", () => input.click());
    input.addEventListener("change", () => { handleBulkFiles(input.files); input.value = ""; });
    document.getElementById("bulkFolderBtn").addEventListener("click", () => {
        const folder = document.createElement("input");
        folder.type = "file";
        folder.multiple = true;
        folder.setAttribute("webkitdirectory", "");
        folder.addEventListener("change", () => handleBulkFiles(folder.files));
        folder.click();
    });
    ["dragenter", "dragover"].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.add("drag"); }));
    ["dragleave", "drop"].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.remove("drag"); }));
    drop.addEventListener("drop", e => handleBulkFiles(e.dataTransfer.files));
    document.getElementById("bulkApplyBtn").disabled = true;
    document.getElementById("bulkApplyBtn").textContent = "ربط الصور";
    document.getElementById("bulkModal").classList.add("open");
}

function closeBulkModal() {
    const st = BulkImages.get();
    if (st && st.urls) st.urls.forEach(u => URL.revokeObjectURL(u));
    BulkImages.set(null);
    document.getElementById("bulkModal").classList.remove("open");
}

async function handleBulkFiles(fileList) {
    const files = [...fileList];
    if (!files.length) return;
    if (files.length > 1500) {
        alert("الحد الأقصى 1500 صورة في المرة الواحدة");
        return;
    }
    const body = document.getElementById("bulkBody");
    body.innerHTML = `<p style="padding:16px; color:var(--text-muted);">جاري تحليل ${files.length} ملف...</p>`;
    const products = await window.SupabaseSync.fetchProducts();
    renderBulkPlan(files, products, false);
}

function renderBulkPlan(files, products, overwrite) {
    const items = BulkImages.buildPlan(files, products, overwrite);
    const sum = BulkImages.summarize(items, products);
    const urls = [];
    BulkImages.set({ files, items, products, overwrite, urls });

    const e = escapeHTML;
    const problems = items.filter(i => ["bad", "unknown", "secondary", "duplicate", "has-image"].includes(i.status)).slice(0, 40);
    const ready = items.filter(i => i.status === "ready").slice(0, 12);
    const thumbs = ready.map(i => {
        const u = URL.createObjectURL(i.file);
        urls.push(u);
        return `<div class="bulk-thumb"><img src="${u}" alt=""><span>WOA-${String(i.product.id).padStart(4, "0")}</span><small>${e(i.product.ar)}</small></div>`;
    }).join("");

    document.getElementById("bulkBody").innerHTML = `
        <div class="import-stats">
            <div class="import-stat ok"><strong>${sum.ready}</strong><span>جاهزة للربط</span></div>
            <div class="import-stat info"><strong>${sum.hasImage}</strong><span>لها صورة حالية</span></div>
            <div class="import-stat muted"><strong>${sum.skipped}</strong><span>مكررة / إضافية</span></div>
            <div class="import-stat ${sum.bad ? "bad" : "muted"}"><strong>${sum.bad}</strong><span>غير مطابقة</span></div>
        </div>
        <p class="import-note">${sum.total} ملف · سيبقى <strong>${sum.missingAfter}</strong> منتج بلا صورة حقيقية بعد هذه العملية.</p>
        <label class="import-backup"><input type="checkbox" id="bulkOverwrite" ${overwrite ? "checked" : ""}> استبدال الصور الحالية الحقيقية أيضاً</label>
        ${thumbs ? `<div class="bulk-thumbs">${thumbs}</div>` : ""}
        ${problems.length ? `<details class="import-errors" open><summary>ملاحظات (${problems.length}${problems.length >= 40 ? "+" : ""})</summary><ul>${problems.map(i => `<li><strong dir="ltr">${e(i.name)}</strong>: ${e(i.note)}</li>`).join("")}</ul></details>` : ""}
        <div class="bulk-actions-row"><button type="button" class="btn-admin-action excel-btn" onclick="openBulkImagesModal()">↩ اختيار ملفات أخرى</button>
        <button type="button" class="btn-admin-action excel-btn" onclick="downloadMissingImagesList()">📋 قائمة المنتجات بلا صور</button></div>`;

    document.getElementById("bulkOverwrite").addEventListener("change", ev => {
        (BulkImages.get().urls || []).forEach(u => URL.revokeObjectURL(u));
        renderBulkPlan(files, products, ev.target.checked);
    });
    const btn = document.getElementById("bulkApplyBtn");
    btn.disabled = sum.ready === 0;
    btn.textContent = `ربط ${sum.ready} صورة`;
}

async function applyBulkImages() {
    const st = BulkImages.get();
    if (!st || !requireAdmin()) return;
    const btn = document.getElementById("bulkApplyBtn");
    btn.disabled = true;
    try {
        const res = await BulkImages.apply((done, total) => { btn.textContent = `جاري الرفع ${done}/${total}`; });
        const failedHtml = res.failed.length
            ? `<details class="import-errors" open><summary>فشل رفع ${res.failed.length} ملف</summary><ul>${res.failed.slice(0, 30).map(f => `<li dir="ltr">${escapeHTML(f.name)}: ${escapeHTML(f.error)}</li>`).join("")}</ul></details>` : "";
        document.getElementById("bulkBody").innerHTML =
            `<p style="padding:16px 4px; color:#047857; font-weight:800;">تم ربط ${res.attached} صورة بالمنتجات وتحديث المتجر.</p>${failedHtml}
             <div class="bulk-actions-row"><button type="button" class="btn-admin-action excel-btn" onclick="downloadMissingImagesList()">📋 قائمة المنتجات بلا صور</button></div>`;
        btn.textContent = "تم";
        showToast(`تم ربط ${res.attached} صورة`);
        loadProducts();
        if (typeof mediaCache !== "undefined") mediaCache = [];
    } catch (err) {
        btn.disabled = false;
        btn.textContent = "إعادة المحاولة";
        document.getElementById("bulkBody").insertAdjacentHTML("afterbegin", `<p style="color:#DC2626;">${escapeHTML(err.message)}</p>`);
    }
}

async function downloadMissingImagesList() {
    const products = await window.SupabaseSync.fetchProducts();
    const cats = await window.SupabaseSync.fetchCategories();
    const catName = id => (cats.find(c => c.id === id) || {}).en || "";
    const missing = products.filter(p => !BulkImages.hasRealImage(p));
    const q = v => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const rows = ["id,file_name,name_ar,name_en,category"].concat(
        missing.map(p => [p.id, `WOA-${String(p.id).padStart(4, "0")}.jpg`, q(p.ar), q(p.en), q(catName(p.category_id))].join(",")));
    const blob = new Blob(["﻿" + rows.join("\n")], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "products-missing-images.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    showToast(`تم تنزيل ${missing.length} منتج بلا صورة`);
}
