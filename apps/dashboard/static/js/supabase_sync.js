/**
 * World of Accessories - Supabase Unified Live Sync
 * Realtime cloud database layer connecting:
 * 1. Admin Portal (Immediate CRUD on woa_products)
 * 2. Client Website (Live reactive catalog with instant price/product updates)
 * 3. Catalogue Center (Live synchronized statistics and print data)
 */

const SUPABASE_CONFIG = {
    url: "https://jzllhisbgjfdnurfuzfb.supabase.co",
    anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6bGxoaXNiZ2pmZG51cmZ1emZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM5NTI5MDksImV4cCI6MjA5OTUyODkwOX0.0iIEyyD9pI8eblIixI8nbHJMm05kngTIMEWAi7yg_Eg"
};

const SupabaseSync = {
    headers: {
        "apikey": SUPABASE_CONFIG.anonKey,
        "Authorization": `Bearer ${SUPABASE_CONFIG.anonKey}`,
        "Content-Type": "application/json",
        "Prefer": "return=representation"
    },

    async fetchCategories() {
        try {
            const url = `${SUPABASE_CONFIG.url}/rest/v1/woa_categories?select=*&order=id.asc`;
            const res = await fetch(url, { headers: this.headers });
            if (res.ok) {
                const data = await res.json();
                if (data && data.length > 0) return data;
            }
        } catch (e) {
            console.warn("[Supabase] Failed to fetch categories, falling back:", e);
        }
        // Fallback to local
        try {
            const res = await fetch("/data/categories_data.json");
            if (res.ok) {
                const data = await res.json();
                return data.categories || [];
            }
        } catch (e) {}
        return [];
    },

    async fetchProducts(filters = {}) {
        try {
            let url = `${SUPABASE_CONFIG.url}/rest/v1/woa_products?select=*&order=id.asc`;
            if (filters.category_id && filters.category_id > 0) {
                url += `&category_id=eq.${filters.category_id}`;
            }
            if (filters.usage_type && filters.usage_type !== "all") {
                url += `&usage_type=eq.${encodeURIComponent(filters.usage_type)}`;
            }
            const res = await fetch(url, { headers: this.headers });
            if (res.ok) {
                const data = await res.json();
                if (data && data.length > 0) return data;
            }
        } catch (e) {
            console.warn("[Supabase] Failed to fetch products, falling back:", e);
        }
        // Fallback to local
        try {
            const res = await fetch("/data/products.json");
            if (res.ok) {
                return await res.json();
            }
        } catch (e) {}
        return [];
    },

    async insertProduct(product) {
        const url = `${SUPABASE_CONFIG.url}/rest/v1/woa_products`;
        const res = await fetch(url, {
            method: "POST",
            headers: this.headers,
            body: JSON.stringify(product)
        });
        if (!res.ok) {
            const err = await res.text();
            throw new Error(err || "Failed to insert product into Supabase");
        }
        return await res.json();
    },

    async updateProduct(id, updates) {
        const url = `${SUPABASE_CONFIG.url}/rest/v1/woa_products?id=eq.${id}`;
        const res = await fetch(url, {
            method: "PATCH",
            headers: this.headers,
            body: JSON.stringify(updates)
        });
        if (!res.ok) {
            const err = await res.text();
            throw new Error(err || "Failed to update product in Supabase");
        }
        return await res.json();
    },

    async deleteProduct(id) {
        const url = `${SUPABASE_CONFIG.url}/rest/v1/woa_products?id=eq.${id}`;
        const res = await fetch(url, {
            method: "DELETE",
            headers: this.headers
        });
        if (!res.ok) {
            const err = await res.text();
            throw new Error(err || "Failed to delete product in Supabase");
        }
        return true;
    }
};

window.SupabaseSync = SupabaseSync;
