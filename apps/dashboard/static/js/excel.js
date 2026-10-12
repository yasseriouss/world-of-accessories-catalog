/**
 * World of Accessories - Excel import / export for products.
 * SheetJS is vendored locally (CSP allows only same-origin scripts) and loaded on demand.
 * Import never deletes: it creates new rows and updates existing ones by id.
 */
const ExcelIO = (() => {
    const USAGE = {
        kitchen: { ar: "مطابخ", en: "Kitchen" },
        dressing: { ar: "دريسينج", en: "Dressing" },
        other: { ar: "أخرى", en: "Other" }
    };
    const USAGE_ALIASES = {
        kitchen: ["kitchen", "kitchens", "مطابخ", "مطبخ"],
        dressing: ["dressing", "دريسينج", "دريسنج", "دريسينغ"],
        other: ["other", "others", "general", "أخرى", "اخرى", "عام", "أخرى وعام", "اخرى وعام"]
    };
    const HEADER_ALIASES = {
        id: ["id", "الكود", "المعرف", "رقم", "code", "sku"],
        ar: ["ar", "name_ar", "name ar", "الاسم", "الاسم بالعربية", "الاسم بالعربي", "اسم المنتج", "اسم المنتج بالعربية"],
        en: ["en", "name_en", "name en", "name", "english", "الاسم بالانجليزية", "الاسم بالإنجليزية", "الاسم الفني"],
        price: ["price", "السعر", "السعر الرسمي"],
        category_id: ["category_id", "category id", "cat_id", "معرف الفئة", "رقم الفئة"],
        category: ["category", "الفئة", "اسم الفئة"],
        usage_type: ["usage_type", "usage", "الاستخدام", "نطاق الاستخدام"],
        image: ["image", "image_url", "img", "الصورة", "رابط الصورة"]
    };
    const MAX_ROWS = 5000;
    const MAX_FILE_BYTES = 10 * 1024 * 1024;
    const CHUNK = 100;
    const PREVIEW_ROWS = 12;

    let plan = null; // { creates, updates, skipped, invalid, rows }

    // ---------- helpers ----------
    async function loadLib() {
        if (window.XLSX) return window.XLSX;
        await new Promise((resolve, reject) => {
            const s = document.createElement("script");
            s.src = "/static/js/vendor/xlsx.full.min.js";
            s.onload = resolve;
            s.onerror = () => reject(new Error("تعذر تحميل مكتبة Excel"));
            document.head.appendChild(s);
        });
        return window.XLSX;
    }

    function stamp() {
        const d = new Date();
        const p = n => String(n).padStart(2, "0");
        return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}`;
    }

    // Neutralise spreadsheet formula injection in exported text
    function safeCell(v) {
        if (typeof v !== "string") return v;
        return /^[=+@]/.test(v) || /^-[^0-9.]/.test(v) ? "'" + v : v;
    }

    function unsafeCell(v) {
        return typeof v === "string" && /^'[=+\-@]/.test(v) ? v.slice(1) : v;
    }

    const ARABIC_DIGITS = { "٠": "0", "١": "1", "٢": "2", "٣": "3", "٤": "4", "٥": "5", "٦": "6", "٧": "7", "٨": "8", "٩": "9", "۰": "0", "۱": "1", "۲": "2", "۳": "3", "۴": "4", "۵": "5", "۶": "6", "۷": "7", "۸": "8", "۹": "9" };

    function normalizePrice(raw) {
        if (raw === null || raw === undefined || raw === "") return null;
        if (typeof raw === "number") return isFinite(raw) && raw >= 0 ? String(Math.round(raw * 100) / 100) : null;
        let s = String(raw).trim().replace(/[٠-٩۰-۹]/g, d => ARABIC_DIGITS[d]);
        s = s.replace(/[٬,\s]/g, "").replace(/٫/g, ".").replace(/[^\d.]/g, "");
        if (!/^\d+(\.\d+)?$/.test(s)) return null;
        const n = Math.round(parseFloat(s) * 100) / 100;
        return isFinite(n) && n >= 0 && n < 1e8 ? String(n) : null;
    }

    function normalizeUsage(raw) {
        const s = String(raw || "").trim().toLowerCase();
        if (!s) return "other";
        for (const [key, list] of Object.entries(USAGE_ALIASES)) {
            if (list.some(a => a.toLowerCase() === s)) return key;
        }
        return null;
    }

    function headerMap(headers) {
        const map = {};
        headers.forEach((h, i) => {
            const norm = String(h || "").trim().toLowerCase();
            for (const [key, list] of Object.entries(HEADER_ALIASES)) {
                if (map[key] === undefined && list.some(a => a.toLowerCase() === norm)) map[key] = i;
            }
        });
        return map;
    }

    async function currentData() {
        const [products, categories] = await Promise.all([
            window.SupabaseSync.fetchProducts(),
            window.SupabaseSync.fetchCategories()
        ]);
        return { products, categories };
    }

    // ---------- export ----------
    function buildWorkbook(XLSX, products, categories) {
        const catName = id => (categories.find(c => c.id === id) || {}).ar || "";
        const rows = products.map(p => ({
            id: p.id,
            ar: safeCell(p.ar || ""),
            en: safeCell(p.en || ""),
            price: p.price === "" || p.price === null ? "" : (isNaN(Number(p.price)) ? p.price : Number(p.price)),
            category_id: p.category_id,
            category: safeCell(catName(p.category_id)),
            usage_type: p.usage_type || "other",
            image: p.image || ""
        }));
        const ws = XLSX.utils.json_to_sheet(rows, { header: ["id", "ar", "en", "price", "category_id", "category", "usage_type", "image"] });
        ws["!cols"] = [{ wch: 7 }, { wch: 42 }, { wch: 42 }, { wch: 10 }, { wch: 12 }, { wch: 26 }, { wch: 12 }, { wch: 60 }];
        ws["!freeze"] = { xSplit: 0, ySplit: 1 };
        ws["!autofilter"] = { ref: `A1:H${rows.length + 1}` };

        const catRows = categories.map(c => ({ category_id: c.id, ar: c.ar, en: c.en }));
        const wsCats = XLSX.utils.json_to_sheet(catRows, { header: ["category_id", "ar", "en"] });
        wsCats["!cols"] = [{ wch: 12 }, { wch: 34 }, { wch: 34 }];

        const help = [
            ["تعليمات الاستيراد / Import notes"],
            ["id", "اتركه فارغاً لإضافة منتج جديد، أو ضع كود منتج موجود لتحديثه."],
            ["ar", "اسم المنتج بالعربية (مطلوب)."],
            ["en", "الاسم بالإنجليزية (اختياري، يُستخدم الاسم العربي إن تُرك فارغاً)."],
            ["price", "السعر كرقم (مثال: 62 أو 62.5)."],
            ["category_id / category", "ضع معرّف الفئة أو اسمها كما في ورقة «الفئات»."],
            ["usage_type", "kitchen أو dressing أو other (أو: مطابخ / دريسينج / أخرى)."],
            ["image", "رابط الصورة (https://...) أو اتركه فارغاً للإبقاء على الصورة الحالية."],
            ["ملاحظة", "الاستيراد لا يحذف أي منتج؛ يضيف ويحدّث فقط."]
        ];
        const wsHelp = XLSX.utils.aoa_to_sheet(help);
        wsHelp["!cols"] = [{ wch: 24 }, { wch: 80 }];

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "المنتجات");
        XLSX.utils.book_append_sheet(wb, wsCats, "الفئات");
        XLSX.utils.book_append_sheet(wb, wsHelp, "التعليمات");
        return wb;
    }

    async function exportProducts(prefix) {
        const XLSX = await loadLib();
        const { products, categories } = await currentData();
        const wb = buildWorkbook(XLSX, products, categories);
        XLSX.writeFile(wb, `${prefix || "woa-products"}-${stamp()}.xlsx`);
        return products.length;
    }

    async function downloadTemplate() {
        const XLSX = await loadLib();
        const { categories } = await currentData();
        const example = [{ id: "", ar: "مفصلة مثال", en: "Example hinge", price: 45, category_id: categories[0] ? categories[0].id : 1, category: categories[0] ? categories[0].ar : "", usage_type: "kitchen", image: "" }];
        const wb = buildWorkbook(XLSX, [], categories);
        const ws = XLSX.utils.json_to_sheet(example, { header: ["id", "ar", "en", "price", "category_id", "category", "usage_type", "image"] });
        ws["!cols"] = [{ wch: 7 }, { wch: 42 }, { wch: 42 }, { wch: 10 }, { wch: 12 }, { wch: 26 }, { wch: 12 }, { wch: 60 }];
        wb.Sheets["المنتجات"] = ws;
        XLSX.writeFile(wb, "woa-products-template.xlsx");
    }

    // ---------- import: parse + validate ----------
    async function parseFile(file) {
        if (file.size > MAX_FILE_BYTES) throw new Error("حجم الملف كبير جداً (الحد الأقصى 10MB)");
        const XLSX = await loadLib();
        const buf = await file.arrayBuffer();
        const wb = XLSX.read(buf, { type: "array", cellDates: false });
        const name = wb.SheetNames.find(n => n === "المنتجات" || n.toLowerCase() === "products") || wb.SheetNames[0];
        const aoa = XLSX.utils.sheet_to_json(wb.Sheets[name], { header: 1, defval: "", blankrows: false });
        if (aoa.length < 2) throw new Error("الملف لا يحتوي على صفوف بيانات");
        if (aoa.length - 1 > MAX_ROWS) throw new Error(`عدد الصفوف يتجاوز الحد (${MAX_ROWS})`);
        const map = headerMap(aoa[0]);
        if (map.ar === undefined) throw new Error("لم أجد عمود اسم المنتج (ar). استخدم القالب المرفق.");
        if (map.price === undefined) throw new Error("لم أجد عمود السعر (price). استخدم القالب المرفق.");
        return { sheet: name, header: aoa[0], map, rows: aoa.slice(1) };
    }

    function buildPlan(parsed, existing, categories) {
        const byId = new Map(existing.map(p => [p.id, p]));
        const catById = new Map(categories.map(c => [c.id, c]));
        const catByName = new Map();
        categories.forEach(c => {
            catByName.set(String(c.ar || "").trim().toLowerCase(), c);
            catByName.set(String(c.en || "").trim().toLowerCase(), c);
        });
        const out = { creates: [], updates: [], skipped: 0, invalid: [], rows: parsed.rows.length };
        const seenIds = new Set();
        const get = (row, key) => (parsed.map[key] === undefined ? "" : unsafeCell(row[parsed.map[key]]));

        parsed.rows.forEach((row, i) => {
            const line = i + 2;
            const errors = [];
            const warnings = [];

            const ar = String(get(row, "ar") ?? "").trim();
            let en = String(get(row, "en") ?? "").trim();
            if (!ar) errors.push("اسم المنتج بالعربية فارغ");
            if (ar.length > 200 || en.length > 200) errors.push("الاسم أطول من 200 حرف");
            if (!en) en = ar;

            const price = normalizePrice(get(row, "price"));
            if (price === null) errors.push("السعر غير صالح");

            let category = null;
            const rawCatId = String(get(row, "category_id") ?? "").trim();
            const rawCat = String(get(row, "category") ?? "").trim();
            if (rawCatId && /^\d+$/.test(rawCatId)) category = catById.get(Number(rawCatId)) || null;
            if (!category && rawCat) category = catByName.get(rawCat.toLowerCase()) || null;
            if (!category) errors.push("الفئة غير معروفة");

            const usage = normalizeUsage(get(row, "usage_type"));
            if (usage === null) errors.push("نطاق الاستخدام غير معروف");

            let image = String(get(row, "image") ?? "").trim();
            const safeRelative = /^[A-Za-z0-9_\-./]+$/.test(image) && !image.includes("..") && !image.startsWith("/");
            if (image && !/^https:\/\//i.test(image) && !safeRelative) {
                errors.push("رابط الصورة يجب أن يبدأ بـ https:// أو يكون مساراً نسبياً صالحاً");
                image = "";
            }

            let id = null;
            const rawId = String(get(row, "id") ?? "").trim();
            if (rawId) {
                const digits = rawId.replace(/[٠-٩]/g, d => ARABIC_DIGITS[d]).replace(/\D/g, "");
                id = digits ? Number(digits) : null;
                if (!id) errors.push("الكود (id) غير صالح");
            }
            if (id) {
                if (seenIds.has(id)) errors.push(`الكود ${id} مكرر في الملف`);
                seenIds.add(id);
            }

            if (errors.length) {
                out.invalid.push({ line, name: ar || "—", errors });
                return;
            }

            const record = {
                ar,
                en,
                price,
                category_id: category.id,
                usage_type: usage,
                usage_ar: USAGE[usage].ar,
                usage_en: USAGE[usage].en
            };

            const current = id ? byId.get(id) : null;
            if (id && !current) warnings.push("الكود غير موجود، سيُضاف كمنتج جديد");
            if (current) {
                record.image = image || current.image || "Branding/logo-100.png";
                const same = ["ar", "en", "category_id", "usage_type", "image"].every(k => String(current[k] ?? "") === String(record[k] ?? "")) &&
                    String(Number(current.price)) === String(Number(record.price));
                if (same) {
                    out.skipped++;
                    return;
                }
                out.updates.push({ line, id, record, before: current });
            } else {
                record.image = image || "Branding/logo-100.png";
                out.creates.push({ line, record, warnings });
            }
        });
        return out;
    }

    // ---------- import: apply ----------
    async function post(path, rows, extraPrefer) {
        const res = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/${path}`, {
            method: "POST",
            headers: await window.SupabaseSync.writeHeaders({ Prefer: "return=minimal" + (extraPrefer ? "," + extraPrefer : "") }),
            body: JSON.stringify(rows)
        });
        await window.SupabaseSync.check(res, "فشل حفظ دفعة من المنتجات");
    }

    async function applyPlan(onProgress) {
        const total = plan.creates.length + plan.updates.length;
        let done = 0;
        const step = n => { done += n; onProgress && onProgress(done, total); };

        for (let i = 0; i < plan.creates.length; i += CHUNK) {
            const chunk = plan.creates.slice(i, i + CHUNK).map(c => c.record);
            await post("woa_products", chunk);
            step(chunk.length);
        }
        for (let i = 0; i < plan.updates.length; i += CHUNK) {
            const chunk = plan.updates.slice(i, i + CHUNK).map(u => ({ id: u.id, ...u.record }));
            await post("woa_products?on_conflict=id", chunk, "resolution=merge-duplicates");
            step(chunk.length);
        }
        try { sessionStorage.removeItem("woa_cache_products"); } catch (e) {}
        return { created: plan.creates.length, updated: plan.updates.length };
    }

    return { exportProducts, downloadTemplate, parseFile, buildPlan, applyPlan, currentData, setPlan: p => { plan = p; }, getPlan: () => plan, PREVIEW_ROWS, USAGE };
})();

// ===================== UI wiring =====================
async function exportProductsExcel() {
    const btn = document.getElementById("btnExportExcel");
    if (btn) btn.disabled = true;
    try {
        const n = await ExcelIO.exportProducts("woa-products");
        showToast(`تم تصدير ${n} منتج إلى Excel`);
    } catch (err) {
        alert("فشل التصدير: " + err.message);
    } finally {
        if (btn) btn.disabled = false;
    }
}

async function downloadImportTemplate() {
    try {
        await ExcelIO.downloadTemplate();
    } catch (err) {
        alert("فشل تنزيل القالب: " + err.message);
    }
}

function openImportPicker() {
    if (!requireAdmin()) return;
    document.getElementById("excelFileInput").click();
}

function closeImportModal() {
    document.getElementById("importModal").classList.remove("open");
    ExcelIO.setPlan(null);
}

async function handleExcelFile(file) {
    if (!file) return;
    if (!requireAdmin()) return;
    const body = document.getElementById("importModalBody");
    const applyBtn = document.getElementById("importApplyBtn");
    applyBtn.disabled = true;
    body.innerHTML = `<p style="padding:16px; color:var(--text-muted);">جاري قراءة الملف والتحقق من البيانات...</p>`;
    document.getElementById("importModal").classList.add("open");

    try {
        const parsed = await ExcelIO.parseFile(file);
        const { products, categories } = await ExcelIO.currentData();
        const plan = ExcelIO.buildPlan(parsed, products, categories);
        ExcelIO.setPlan(plan);

        const e = escapeHTML;
        const errList = plan.invalid.slice(0, 40).map(r =>
            `<li><strong>سطر ${r.line}</strong> (${e(r.name)}): ${r.errors.map(e).join("، ")}</li>`).join("");
        const sample = [...plan.updates.slice(0, 6).map(u => ({ kind: "تحديث", line: u.line, r: u.record })),
            ...plan.creates.slice(0, ExcelIO.PREVIEW_ROWS - Math.min(6, plan.updates.length)).map(c => ({ kind: "جديد", line: c.line, r: c.record, w: c.warnings }))];
        const catName = id => (categories.find(c => c.id === id) || {}).ar || id;

        body.innerHTML = `
            <div class="import-stats">
                <div class="import-stat ok"><strong>${plan.creates.length}</strong><span>منتج جديد</span></div>
                <div class="import-stat info"><strong>${plan.updates.length}</strong><span>تحديث</span></div>
                <div class="import-stat muted"><strong>${plan.skipped}</strong><span>بدون تغيير</span></div>
                <div class="import-stat ${plan.invalid.length ? "bad" : "muted"}"><strong>${plan.invalid.length}</strong><span>صفوف بها أخطاء</span></div>
            </div>
            <p class="import-note">الورقة: <strong>${e(parsed.sheet)}</strong> · ${plan.rows} صف. الصفوف التي بها أخطاء لن تُستورد. لا يتم حذف أي منتج.</p>
            ${plan.invalid.length ? `<details class="import-errors" open><summary>الأخطاء (${plan.invalid.length})</summary><ul>${errList}</ul>${plan.invalid.length > 40 ? "<p>... والمزيد</p>" : ""}</details>` : ""}
            ${sample.length ? `<div class="table-responsive"><table class="admin-table" style="min-width:560px;">
                <thead><tr><th>النوع</th><th>سطر</th><th>الاسم</th><th>السعر</th><th>الفئة</th><th>الاستخدام</th></tr></thead>
                <tbody>${sample.map(s => `<tr><td>${s.kind}</td><td>${s.line}</td><td>${e(s.r.ar)}</td><td>${e(s.r.price)}</td><td>${e(catName(s.r.category_id))}</td><td>${e(s.r.usage_ar)}</td></tr>`).join("")}</tbody>
            </table></div><p class="import-note">معاينة أول ${sample.length} صف.</p>` : ""}
            <label class="import-backup"><input type="checkbox" id="importBackup" checked> تنزيل نسخة احتياطية من المنتجات الحالية قبل التطبيق</label>`;
        applyBtn.disabled = plan.creates.length + plan.updates.length === 0;
        applyBtn.textContent = `تطبيق (${plan.creates.length + plan.updates.length})`;
    } catch (err) {
        body.innerHTML = `<p style="padding:16px; color:#DC2626;">${escapeHTML(err.message)}</p>`;
    }
}

async function applyImport() {
    const plan = ExcelIO.getPlan();
    if (!plan || !requireAdmin()) return;
    const btn = document.getElementById("importApplyBtn");
    const body = document.getElementById("importModalBody");
    btn.disabled = true;
    try {
        if (document.getElementById("importBackup") && document.getElementById("importBackup").checked) {
            await ExcelIO.exportProducts("woa-products-backup");
        }
        const res = await ExcelIO.applyPlan((done, total) => { btn.textContent = `جاري الحفظ ${done}/${total}`; });
        body.innerHTML = `<p style="padding:20px; color:#047857; font-weight:700;">تم الاستيراد بنجاح: ${res.created} منتج جديد، ${res.updated} تحديث.</p>`;
        btn.textContent = "تم";
        showToast("تم استيراد المنتجات وتحديث المتجر");
        ExcelIO.setPlan(null);
        loadProducts();
    } catch (err) {
        btn.disabled = false;
        btn.textContent = "إعادة المحاولة";
        body.insertAdjacentHTML("afterbegin", `<p style="padding:8px 0; color:#DC2626;">فشل الاستيراد: ${escapeHTML(err.message)}</p>`);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("excelFileInput");
    if (input) {
        input.addEventListener("change", () => {
            handleExcelFile(input.files[0]);
            input.value = "";
        });
    }
});
