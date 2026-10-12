/**
 * World of Accessories - Dashboard data layer
 * Public reads use the anon key. All writes, uploads and deletes require a
 * signed-in admin session (Supabase Auth) and are enforced server-side by RLS.
 */

const SUPABASE_CONFIG = {
    url: "https://jzllhisbgjfdnurfuzfb.supabase.co",
    anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6bGxoaXNiZ2pmZG51cmZ1emZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM5NTI5MDksImV4cCI6MjA5OTUyODkwOX0.0iIEyyD9pI8eblIixI8nbHJMm05kngTIMEWAi7yg_Eg",
    bucket: "product-images"
};

const PRODUCT_COLUMNS = "id,ar,en,price,category_id,usage_type,usage_ar,usage_en,image";
const WRITABLE = {
    woa_products: ["ar", "en", "price", "category_id", "usage_type", "usage_ar", "usage_en", "image"],
    woa_categories: ["ar", "en", "icon", "slug"],
    woa_banners: ["badge_ar", "badge_en", "text_ar", "text_en", "link", "active", "sort_order"]
};
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SOURCE_BYTES = 15 * 1024 * 1024;
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const IMAGE_MAX_EDGE = 1600;
const IMAGE_QUALITY = 0.82;
const SESSION_KEY = "woa_sb_session";

const SupabaseAuth = {
    load() {
        try {
            return JSON.parse(sessionStorage.getItem(SESSION_KEY));
        } catch (e) {
            return null;
        }
    },

    save(data) {
        const session = {
            access_token: data.access_token,
            refresh_token: data.refresh_token,
            expires_at: Date.now() + (data.expires_in || 3600) * 1000,
            email: data.user && data.user.email
        };
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
        return session;
    },

    isLoggedIn() {
        return !!this.load();
    },

    email() {
        const s = this.load();
        return s ? s.email : null;
    },

    async login(email, password) {
        const res = await fetch(`${SUPABASE_CONFIG.url}/auth/v1/token?grant_type=password`, {
            method: "POST",
            headers: { apikey: SUPABASE_CONFIG.anonKey, "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
            throw new Error(data.error_description || data.msg || "فشل تسجيل الدخول");
        }
        return this.save(data);
    },

    async refresh(session) {
        const res = await fetch(`${SUPABASE_CONFIG.url}/auth/v1/token?grant_type=refresh_token`, {
            method: "POST",
            headers: { apikey: SUPABASE_CONFIG.anonKey, "Content-Type": "application/json" },
            body: JSON.stringify({ refresh_token: session.refresh_token })
        });
        if (!res.ok) {
            this.logout();
            return null;
        }
        return this.save(await res.json());
    },

    async getToken() {
        let session = this.load();
        if (!session) return null;
        if (Date.now() > session.expires_at - 60000) {
            session = await this.refresh(session);
        }
        return session ? session.access_token : null;
    },

    logout() {
        sessionStorage.removeItem(SESSION_KEY);
    }
};

const SupabaseSync = {
    get readHeaders() {
        return { apikey: SUPABASE_CONFIG.anonKey, Authorization: `Bearer ${SUPABASE_CONFIG.anonKey}` };
    },

    async writeHeaders(extra = {}) {
        const token = await SupabaseAuth.getToken();
        if (!token) throw new Error("انتهت الجلسة، يرجى تسجيل الدخول مرة أخرى");
        return {
            apikey: SUPABASE_CONFIG.anonKey,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Prefer: "return=representation",
            ...extra
        };
    },

    pick(table, row) {
        const out = {};
        (WRITABLE[table] || []).forEach(k => {
            if (row[k] !== undefined) out[k] = row[k];
        });
        return out;
    },

    async check(res, fallbackMsg) {
        if (res.ok) return;
        if (res.status === 401 || res.status === 403) {
            SupabaseAuth.logout();
            throw new Error("غير مصرح لك بتنفيذ هذا الإجراء، سجّل الدخول بحساب المسؤول");
        }
        let detail = "";
        try {
            const j = await res.json();
            detail = j.message || j.error || "";
            if (j.code === "23503") detail = "لا يمكن الحذف لأن هناك عناصر مرتبطة به";
        } catch (e) {}
        throw new Error(detail || fallbackMsg);
    },

    // ---------- generic table helpers ----------
    async select(table, query) {
        const res = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/${table}?${query}`, { headers: this.readHeaders });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
    },

    async insertRow(table, row) {
        const res = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/${table}`, {
            method: "POST",
            headers: await this.writeHeaders(),
            body: JSON.stringify(this.pick(table, row))
        });
        await this.check(res, "فشل الحفظ");
        return (await res.json())[0];
    },

    async updateRow(table, id, row) {
        const res = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/${table}?id=eq.${Number(id)}`, {
            method: "PATCH",
            headers: await this.writeHeaders(),
            body: JSON.stringify(this.pick(table, row))
        });
        await this.check(res, "فشل التحديث");
        return (await res.json())[0];
    },

    async deleteRow(table, id) {
        const res = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/${table}?id=eq.${Number(id)}`, {
            method: "DELETE",
            headers: await this.writeHeaders()
        });
        await this.check(res, "فشل الحذف");
        return true;
    },

    // ---------- products ----------
    async fetchProducts() {
        try {
            const data = await this.select("woa_products", `select=${PRODUCT_COLUMNS}&order=id.asc`);
            if (data && data.length > 0) return data;
        } catch (e) {
            console.warn("[Supabase] products fetch failed, using local fallback:", e);
        }
        try {
            const res = await fetch("/data/products.json");
            if (res.ok) return await res.json();
        } catch (e) {}
        return [];
    },
    insertProduct(p) { return this.insertRow("woa_products", p); },
    updateProduct(id, p) { return this.updateRow("woa_products", id, p); },
    deleteProduct(id) { return this.deleteRow("woa_products", id); },

    // ---------- categories ----------
    async fetchCategories() {
        try {
            const data = await this.select("woa_categories", "select=*&order=id.asc");
            if (data && data.length > 0) return data;
        } catch (e) {
            console.warn("[Supabase] categories fetch failed, using local fallback:", e);
        }
        try {
            const res = await fetch("/data/categories_data.json");
            if (res.ok) return (await res.json()).categories || [];
        } catch (e) {}
        return [];
    },
    insertCategory(c) { return this.insertRow("woa_categories", c); },
    updateCategory(id, c) { return this.updateRow("woa_categories", id, c); },
    deleteCategory(id) { return this.deleteRow("woa_categories", id); },

    // ---------- banners ----------
    fetchBanners() {
        return this.select("woa_banners", "select=*&order=sort_order.asc,id.asc");
    },
    insertBanner(b) { return this.insertRow("woa_banners", b); },
    updateBanner(id, b) { return this.updateRow("woa_banners", id, b); },
    deleteBanner(id) { return this.deleteRow("woa_banners", id); },

    // ---------- settings (key -> json) ----------
    async fetchSettings() {
        const rows = await this.select("woa_settings", "select=key,value");
        const out = {};
        rows.forEach(r => { out[r.key] = r.value || {}; });
        return out;
    },

    async saveSetting(key, value) {
        const res = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/woa_settings?on_conflict=key`, {
            method: "POST",
            headers: await this.writeHeaders({ Prefer: "resolution=merge-duplicates,return=representation" }),
            body: JSON.stringify({ key, value })
        });
        await this.check(res, "فشل حفظ الإعدادات");
        return (await res.json())[0];
    },

    // ---------- images ----------
    publicUrl(path) {
        return `${SUPABASE_CONFIG.url}/storage/v1/object/public/${SUPABASE_CONFIG.bucket}/${path}`;
    },

    async loadBitmap(file) {
        if (window.createImageBitmap) {
            try {
                return await createImageBitmap(file, { imageOrientation: "from-image" });
            } catch (e) {}
        }
        return new Promise((resolve, reject) => {
            const url = URL.createObjectURL(file);
            const img = new Image();
            img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
            img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("تعذر قراءة الصورة، تأكد أن الملف صورة صالحة")); };
            img.src = url;
        });
    },

    // Resize (max edge) and re-encode to WebP so uploads are small and fast.
    async prepareImage(file) {
        if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
            throw new Error("نوع الملف غير مدعوم (JPG, PNG, WEBP, GIF فقط)");
        }
        if (file.size > MAX_SOURCE_BYTES) {
            throw new Error("حجم الصورة كبير جداً (الحد الأقصى 15MB)");
        }
        if (file.type === "image/gif") {
            if (file.size > MAX_UPLOAD_BYTES) throw new Error("ملف GIF يتجاوز 5MB");
            return { blob: file, type: file.type, ext: "gif", before: file.size, after: file.size };
        }

        const bmp = await this.loadBitmap(file);
        const w = bmp.width, h = bmp.height;
        const scale = Math.min(1, IMAGE_MAX_EDGE / Math.max(w, h));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(w * scale));
        canvas.height = Math.max(1, Math.round(h * scale));
        const ctx = canvas.getContext("2d");
        ctx.drawImage(bmp, 0, 0, canvas.width, canvas.height);
        if (bmp.close) bmp.close();

        let blob = await new Promise(res => canvas.toBlob(res, "image/webp", IMAGE_QUALITY));
        let type = "image/webp", ext = "webp";
        if (!blob || blob.type !== "image/webp") {
            blob = await new Promise(res => canvas.toBlob(res, "image/jpeg", IMAGE_QUALITY));
            type = "image/jpeg";
            ext = "jpg";
        }
        if (!blob) throw new Error("تعذر معالجة الصورة");
        // Keep the original when re-encoding did not help and it is already small enough.
        if (blob.size >= file.size && scale === 1 && file.size <= MAX_UPLOAD_BYTES) {
            blob = file; type = file.type; ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
        }
        if (blob.size > MAX_UPLOAD_BYTES) throw new Error("الصورة بعد المعالجة ما زالت أكبر من 5MB");
        return { blob, type, ext, before: file.size, after: blob.size };
    },

    uploadBlob(path, blob, type, onProgress) {
        return new Promise(async (resolve, reject) => {
            const token = await SupabaseAuth.getToken();
            if (!token) return reject(new Error("انتهت الجلسة، يرجى تسجيل الدخول مرة أخرى"));
            const xhr = new XMLHttpRequest();
            xhr.open("POST", `${SUPABASE_CONFIG.url}/storage/v1/object/${SUPABASE_CONFIG.bucket}/${path}`);
            xhr.setRequestHeader("apikey", SUPABASE_CONFIG.anonKey);
            xhr.setRequestHeader("Authorization", `Bearer ${token}`);
            xhr.setRequestHeader("Content-Type", type);
            xhr.setRequestHeader("Cache-Control", "max-age=31536000");
            xhr.upload.onprogress = e => {
                if (onProgress && e.lengthComputable) onProgress(e.loaded / e.total);
            };
            xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300) return resolve(this.publicUrl(path));
                if (xhr.status === 401 || xhr.status === 403) {
                    SupabaseAuth.logout();
                    return reject(new Error("غير مصرح لك برفع الصور، سجّل الدخول بحساب المسؤول"));
                }
                let msg = "فشل رفع الصورة";
                try { msg = JSON.parse(xhr.responseText).message || msg; } catch (e) {}
                reject(new Error(msg));
            };
            xhr.onerror = () => reject(new Error("تعذر الاتصال بالخادم أثناء رفع الصورة"));
            xhr.send(blob);
        });
    },

    // Full pipeline: validate -> resize/compress -> upload. Returns { url, before, after }.
    async uploadImage(file, folder = "misc", onProgress) {
        const prepared = await this.prepareImage(file);
        const safeFolder = String(folder).replace(/[^a-z0-9_-]/gi, "") || "misc";
        const rand = Math.random().toString(36).slice(2, 10);
        const path = `${safeFolder}/${Date.now()}-${rand}.${prepared.ext}`;
        const url = await this.uploadBlob(path, prepared.blob, prepared.type, onProgress);
        return { url, path, before: prepared.before, after: prepared.after };
    },

    // ---------- media library ----------
    async listFolder(prefix) {
        const token = await SupabaseAuth.getToken();
        if (!token) throw new Error("انتهت الجلسة، يرجى تسجيل الدخول مرة أخرى");
        const res = await fetch(`${SUPABASE_CONFIG.url}/storage/v1/object/list/${SUPABASE_CONFIG.bucket}`, {
            method: "POST",
            headers: { apikey: SUPABASE_CONFIG.anonKey, Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
            body: JSON.stringify({ prefix, limit: 300, offset: 0, sortBy: { column: "created_at", order: "desc" } })
        });
        await this.check(res, "تعذر تحميل مكتبة الوسائط");
        return res.json();
    },

    async listMedia() {
        const root = await this.listFolder("");
        const files = [];
        const folders = [];
        root.forEach(e => (e.id ? files.push({ ...e, path: e.name }) : folders.push(e.name)));
        for (const f of folders) {
            const inner = await this.listFolder(f);
            inner.filter(e => e.id).forEach(e => files.push({ ...e, path: `${f}/${e.name}` }));
        }
        return files
            .filter(f => f.name !== ".emptyFolderPlaceholder")
            .map(f => ({
                path: f.path,
                name: f.name,
                size: f.metadata && f.metadata.size,
                type: f.metadata && f.metadata.mimetype,
                created: f.created_at,
                url: this.publicUrl(f.path)
            }));
    },

    async deleteMedia(paths) {
        const res = await fetch(`${SUPABASE_CONFIG.url}/storage/v1/object/${SUPABASE_CONFIG.bucket}`, {
            method: "DELETE",
            headers: await this.writeHeaders(),
            body: JSON.stringify({ prefixes: paths })
        });
        await this.check(res, "فشل حذف الصورة");
        return true;
    }
};

window.SupabaseAuth = SupabaseAuth;
window.SupabaseSync = SupabaseSync;
