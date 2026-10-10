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

document.addEventListener("DOMContentLoaded", () => {
    checkAdminAuth();
    loadAdminStats();
    loadCategories();
    loadProducts();
    setupImageUploader();
});

// ----------------- Auth & PIN Check -----------------
function checkAdminAuth() {
    const token = sessionStorage.getItem("woa_admin_token");
    const authModal = document.getElementById("authModal");
    if (!token) {
        if (authModal) authModal.classList.add("open");
    } else {
        if (authModal) authModal.classList.remove("open");
    }
}

async function submitAdminPin() {
    const pin = document.getElementById("pinInput").value;
    try {
        const res = await fetch("/api/admin/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ pin: pin })
        });
        if (res.ok) {
            const data = await res.json();
            if (data.success) {
                sessionStorage.setItem("woa_admin_token", data.token || "admin_session_ok");
                document.getElementById("authModal").classList.remove("open");
                showToast("مرحباً بك! تم تسجيل الدخول بنجاح.");
                loadAdminStats();
                loadProducts();
                return;
            }
        }
    } catch (err) {
        // Fallback for static deployment
    }

    if (pin === "2026") {
        sessionStorage.setItem("woa_admin_token", "admin_static_session_2026");
        document.getElementById("authModal").classList.remove("open");
        showToast("مرحباً بك! تم تسجيل الدخول بنجاح (الوضع الإداري المعتمد).");
        loadAdminStats();
        loadProducts();
    } else {
        alert("رمز الدخول غير صحيح (PIN خاطئ)");
    }
}

function adminLogout() {
    sessionStorage.removeItem("woa_admin_token");
    window.location.reload();
}

// ----------------- Stats & Generator Status -----------------
async function loadAdminStats() {
    try {
        const statRes = await fetch("/api/generator-status");
        const statData = await statRes.json();
        if (statData.last_generated_at) {
            const d = new Date(statData.last_generated_at);
            document.getElementById("statLastBuild").textContent = d.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
        } else {
            document.getElementById("statLastBuild").textContent = "جاهز";
        }
    } catch (err) {
        console.error("Failed to load status:", err);
    }
}

async function triggerManualGeneration() {
    const btn = document.getElementById("btnGenNow");
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = "⏳ جاري التوليد...";
    }

    try {
        const res = await fetch("/api/generate-catalogs", { method: "POST" });
        const data = await res.json();
        if (res.ok && data.success) {
            showToast("✨ تم توليد كافة الكتالوجات المطبوعة بنجاح!");
            loadAdminStats();
        } else {
            alert("حدث خطأ أثناء التوليد: " + (data.detail || ""));
        }
    } catch (err) {
        alert("فشل الاتصال بسيرفر التوليد");
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = "⚡ توليد الكتالوجات الآن";
        }
    }
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
        filterOptions += `<option value="${c.id}">${c.icon || '📦'} ${c.ar} (${c.live_count || ''})</option>`;
        modalOptions += `<option value="${c.id}">${c.icon || '📦'} ${c.ar}</option>`;
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
                <td><span class="sku-badge">${code}</span></td>
                <td><img src="/${img}" class="table-thumb" alt="Product"></td>
                <td><strong>${p.ar || '-'}</strong></td>
                <td><span style="color:var(--text-muted); font-size:12px;">${p.en || '-'}</span></td>
                <td><span class="cat-badge-sm">${cat.icon} ${cat.ar}</span></td>
                <td><span class="cat-badge-sm" style="background:#FFF7ED; color:#D96010; font-weight:700;">${uIcon} ${uName}</span></td>
                <td><span class="price-bold">${p.price}</span> <small style="color:var(--text-muted);">ج.م</small></td>
                <td>
                    <div class="actions-cell">
                        <button class="btn-table-icon" title="تعديل المنتج" onclick="openEditModal(${p.id})">✏️</button>
                        <button class="btn-table-icon btn-delete" title="حذف المنتج" onclick="confirmDeleteProduct(${p.id})">🗑️</button>
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
    document.getElementById("previewImg").src = `/${currentUploadedImg}`;

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
    document.getElementById("previewImg").src = `/${currentUploadedImg}`;

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

    try {
        let savedSuccessfully = false;

        // 1. Persist directly to Supabase Cloud Database (affects web, print, admin everywhere)
        if (window.SupabaseSync) {
            try {
                if (currentEditId) {
                    await window.SupabaseSync.updateProduct(currentEditId, payload);
                } else {
                    await window.SupabaseSync.insertProduct(payload);
                }
                savedSuccessfully = true;
            } catch (supErr) {
                console.warn("Supabase direct write failed, attempting backend fallback:", supErr);
            }
        }

        // 2. Also notify local backend if online
        try {
            if (currentEditId) {
                await fetch(`/api/products/${currentEditId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });
            } else {
                await fetch("/api/products", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });
            }
            savedSuccessfully = true;
        } catch (backendErr) {}

        if (savedSuccessfully) {
            closeProductModal();
            showToast("✨ تم حفظ المنتج بنجاح وتحديث قاعدة البيانات السحابية (Supabase) لكافة المشاريع!");
            loadProducts();
            loadCategories();
            loadAdminStats();
        } else {
            alert("حدث خطأ أثناء حفظ المنتج، يرجى التحقق من الاتصال.");
        }
    } catch (err) {
        alert("فشل حفظ المنتج: " + err.message);
    }
}

// ----------------- Delete Product -----------------
async function confirmDeleteProduct(prodId) {
    if (!confirm(`هل أنت متأكد من رغبتك في حذف هذا المنتج (ID: ${prodId})؟`)) {
        return;
    }

    try {
        let deletedSuccessfully = false;

        // 1. Delete from Supabase Cloud Database
        if (window.SupabaseSync) {
            try {
                await window.SupabaseSync.deleteProduct(prodId);
                deletedSuccessfully = true;
            } catch (supErr) {
                console.warn("Supabase delete failed:", supErr);
            }
        }

        // 2. Notify local backend
        try {
            const res = await fetch(`/api/products/${prodId}`, { method: "DELETE" });
            if (res.ok) deletedSuccessfully = true;
        } catch (backendErr) {}

        if (deletedSuccessfully) {
            showToast("🗑️ تم حذف المنتج بنجاح وتحديث كافة المشاريع!");
            loadProducts();
            loadCategories();
            loadAdminStats();
        } else {
            alert("تعذر حذف المنتج، يرجى المحاولة لاحقاً.");
        }
    } catch (err) {
        alert("فشل حذف المنتج: " + err.message);
    }
}

// ----------------- Image Uploader -----------------
function setupImageUploader() {
    const fileInput = document.getElementById("fileUploadInput");
    if (!fileInput) return;

    fileInput.addEventListener("change", async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData
            });
            const data = await res.json();
            if (res.ok && data.success) {
                currentUploadedImg = data.url;
                document.getElementById("previewImg").src = `/${data.url}`;
                showToast("تم رفع الصورة بنجاح!");
            } else {
                alert(data.detail || "فشل رفع الصورة");
            }
        } catch (err) {
            alert("حدث خطأ أثناء رفع الصورة");
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
