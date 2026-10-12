/**
 * World of Accessories - Dashboard Supabase layer
 * Public reads use the anon key. All writes and uploads require a signed-in
 * admin session (Supabase Auth) and are enforced server-side by RLS.
 */

const SUPABASE_CONFIG = {
    url: "https://jzllhisbgjfdnurfuzfb.supabase.co",
    anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6bGxoaXNiZ2pmZG51cmZ1emZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM5NTI5MDksImV4cCI6MjA5OTUyODkwOX0.0iIEyyD9pI8eblIixI8nbHJMm05kngTIMEWAi7yg_Eg",
    bucket: "product-images"
};

const PRODUCT_COLUMNS = "id,ar,en,price,category_id,usage_type,usage_ar,usage_en,image";
const WRITABLE_FIELDS = ["ar", "en", "price", "category_id", "usage_type", "usage_ar", "usage_en", "image"];
const ALLOWED_IMAGE_TYPES = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif" };
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
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
        return {
            apikey: SUPABASE_CONFIG.anonKey,
            Authorization: `Bearer ${SUPABASE_CONFIG.anonKey}`
        };
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

    pickWritable(product) {
        const out = {};
        WRITABLE_FIELDS.forEach(k => {
            if (product[k] !== undefined) out[k] = product[k];
        });
        return out;
    },

    async checkWrite(res, fallbackMsg) {
        if (res.ok) return;
        if (res.status === 401 || res.status === 403) {
            SupabaseAuth.logout();
            throw new Error("غير مصرح لك بتنفيذ هذا الإجراء");
        }
        const detail = await res.text();
        throw new Error(detail || fallbackMsg);
    },

    async fetchCategories() {
        try {
            const res = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/woa_categories?select=*&order=id.asc`, { headers: this.readHeaders });
            if (res.ok) {
                const data = await res.json();
                if (data && data.length > 0) return data;
            }
        } catch (e) {
            console.warn("[Supabase] categories fetch failed, using local fallback:", e);
        }
        try {
            const res = await fetch("/data/categories_data.json");
            if (res.ok) {
                const data = await res.json();
                return data.categories || [];
            }
        } catch (e) {}
        return [];
    },

    async fetchProducts() {
        try {
            const res = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/woa_products?select=${PRODUCT_COLUMNS}&order=id.asc`, { headers: this.readHeaders });
            if (res.ok) {
                const data = await res.json();
                if (data && data.length > 0) return data;
            }
        } catch (e) {
            console.warn("[Supabase] products fetch failed, using local fallback:", e);
        }
        try {
            const res = await fetch("/data/products.json");
            if (res.ok) return await res.json();
        } catch (e) {}
        return [];
    },

    async insertProduct(product) {
        const res = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/woa_products`, {
            method: "POST",
            headers: await this.writeHeaders(),
            body: JSON.stringify(this.pickWritable(product))
        });
        await this.checkWrite(res, "Failed to insert product");
        return res.json();
    },

    async updateProduct(id, updates) {
        const res = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/woa_products?id=eq.${Number(id)}`, {
            method: "PATCH",
            headers: await this.writeHeaders(),
            body: JSON.stringify(this.pickWritable(updates))
        });
        await this.checkWrite(res, "Failed to update product");
        return res.json();
    },

    async deleteProduct(id) {
        const res = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/woa_products?id=eq.${Number(id)}`, {
            method: "DELETE",
            headers: await this.writeHeaders()
        });
        await this.checkWrite(res, "Failed to delete product");
        return true;
    },

    async uploadImage(file) {
        const ext = ALLOWED_IMAGE_TYPES[file.type];
        if (!ext) throw new Error("نوع الصورة غير مدعوم (JPG, PNG, WEBP, GIF فقط)");
        if (file.size > MAX_IMAGE_BYTES) throw new Error("حجم الصورة يتجاوز 5MB");

        const token = await SupabaseAuth.getToken();
        if (!token) throw new Error("انتهت الجلسة، يرجى تسجيل الدخول مرة أخرى");

        const rand = Math.random().toString(36).slice(2, 10);
        const path = `${Date.now()}-${rand}.${ext}`;
        const res = await fetch(`${SUPABASE_CONFIG.url}/storage/v1/object/${SUPABASE_CONFIG.bucket}/${path}`, {
            method: "POST",
            headers: {
                apikey: SUPABASE_CONFIG.anonKey,
                Authorization: `Bearer ${token}`,
                "Content-Type": file.type,
                "Cache-Control": "max-age=31536000"
            },
            body: file
        });
        await this.checkWrite(res, "Image upload failed");
        return `${SUPABASE_CONFIG.url}/storage/v1/object/public/${SUPABASE_CONFIG.bucket}/${path}`;
    }
};

window.SupabaseAuth = SupabaseAuth;
window.SupabaseSync = SupabaseSync;
