/**
 * World of Accessories - Storefront Supabase layer (read-only)
 * The storefront never writes: RLS only permits admin writes via the dashboard.
 */

const SUPABASE_CONFIG = {
    url: "https://jzllhisbgjfdnurfuzfb.supabase.co",
    anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6bGxoaXNiZ2pmZG51cmZ1emZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM5NTI5MDksImV4cCI6MjA5OTUyODkwOX0.0iIEyyD9pI8eblIixI8nbHJMm05kngTIMEWAi7yg_Eg"
};

const PRODUCT_COLUMNS = "id,ar,en,price,category_id,usage_type,usage_ar,usage_en,image";
const CACHE_TTL_MS = 5 * 60 * 1000;

const SupabaseSync = {
    headers: {
        apikey: SUPABASE_CONFIG.anonKey,
        Authorization: `Bearer ${SUPABASE_CONFIG.anonKey}`
    },

    cacheGet(key) {
        try {
            const raw = sessionStorage.getItem(key);
            if (!raw) return null;
            const { t, d } = JSON.parse(raw);
            return Date.now() - t < CACHE_TTL_MS ? d : null;
        } catch (e) {
            return null;
        }
    },

    cacheSet(key, data) {
        try {
            sessionStorage.setItem(key, JSON.stringify({ t: Date.now(), d: data }));
        } catch (e) {}
    },

    async fetchRest(path, cacheKey) {
        const cached = this.cacheGet(cacheKey);
        if (cached) return cached;
        const res = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/${path}`, { headers: this.headers });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) this.cacheSet(cacheKey, data);
        return data;
    },

    async fetchCategories() {
        try {
            const data = await this.fetchRest("woa_categories?select=*&order=id.asc", "woa_cache_categories");
            if (data && data.length > 0) return data;
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

    async fetchRatingSummary() {
        try {
            const rows = await this.fetchRest("woa_rating_summary?select=product_id,avg_rating,ratings_count", "woa_cache_ratings");
            const map = {};
            (rows || []).forEach(r => { map[r.product_id] = { avg: Number(r.avg_rating), count: Number(r.ratings_count) }; });
            return map;
        } catch (e) {
            return {};
        }
    },

    async submitRating(productId, rating) {
        let clientId = null;
        try { clientId = localStorage.getItem("woa_client_id"); } catch (e) {}
        if (!clientId) {
            clientId = "c-" + (window.crypto && crypto.randomUUID ? crypto.randomUUID() : Date.now() + "-" + Math.random().toString(36).slice(2, 12));
            try { localStorage.setItem("woa_client_id", clientId); } catch (e) {}
        }
        const res = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/woa_ratings`, {
            method: "POST",
            headers: { ...this.headers, "Content-Type": "application/json", Prefer: "return=minimal" },
            body: JSON.stringify({ product_id: Number(productId), rating: Number(rating), client_id: clientId })
        });
        if (res.status === 409) return { duplicate: true };
        if (!res.ok) throw new Error("HTTP " + res.status);
        try { sessionStorage.removeItem("woa_cache_ratings"); } catch (e) {}
        return { ok: true };
    },

    async fetchSite() {
        try {
            const rows = await this.fetchRest("woa_settings?select=value&key=eq.site", "woa_cache_site");
            return (rows && rows[0] && rows[0].value) || {};
        } catch (e) {
            return {};
        }
    },

    async fetchBanners() {
        try {
            const data = await this.fetchRest("woa_banners?select=id,badge_ar,badge_en,text_ar,text_en,link,active&active=eq.true&order=sort_order.asc,id.asc", "woa_cache_banners");
            if (Array.isArray(data) && data.length > 0) return data;
        } catch (e) {
            console.warn("[Supabase] banners fetch failed, using local fallback:", e);
        }
        try {
            const res = await fetch("/data/banners.json");
            if (res.ok) return await res.json();
        } catch (e) {}
        return [];
    },

    async fetchProducts(filters = {}) {
        try {
            let data = await this.fetchRest(`woa_products?select=${PRODUCT_COLUMNS}&order=id.asc`, "woa_cache_products");
            if (filters.category_id && filters.category_id > 0) {
                data = data.filter(p => p.category_id === Number(filters.category_id));
            }
            if (filters.usage_type && filters.usage_type !== "all") {
                data = data.filter(p => p.usage_type === filters.usage_type);
            }
            if (data && data.length > 0) return data;
        } catch (e) {
            console.warn("[Supabase] products fetch failed, using local fallback:", e);
        }
        try {
            const res = await fetch("/data/products.json");
            if (res.ok) return await res.json();
        } catch (e) {}
        return [];
    }
};

window.SupabaseSync = SupabaseSync;
