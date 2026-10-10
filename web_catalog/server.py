#!/usr/bin/env python3
"""
Web Catalog & Admin Backend Server
FastAPI Server providing:
1. Customer-Facing Responsive Web Catalog
2. Private Admin Dashboard (CRUD, Image Upload, Catalog Generator Trigger)
3. RESTful Products & Categories API
"""

import os
import sys
import json
import shutil
from datetime import datetime
from typing import Optional, List
import threading

from fastapi import FastAPI, HTTPException, UploadFile, File, Form, Depends, Header, Request
from fastapi.responses import HTMLResponse, JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

# Ensure root is in sys.path
root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)

from catalog_generator.generator import CatalogGenerator

app = FastAPI(title="World of Accessories - Web Catalog & Admin API", version="2.0.0")

DATA_DIR = os.path.join(root_dir, "data")
PRODUCTS_FILE = os.path.join(DATA_DIR, "products.json")
CATEGORIES_FILE = os.path.join(DATA_DIR, "categories_data.json")
STATUS_FILE = os.path.join(root_dir, "catalog_generator", "status.json")
UPLOAD_DIR = os.path.join(root_dir, "assets", "products")
os.makedirs(UPLOAD_DIR, exist_ok=True)

ADMIN_PIN = os.environ.get("ADMIN_PIN", "2026")
generation_lock = threading.Lock()

# ----------------- Helper Functions -----------------

def load_products():
    if not os.path.exists(PRODUCTS_FILE):
        return []
    try:
        with open(PRODUCTS_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        print(f"[ERROR] Failed to read {PRODUCTS_FILE}: {e}")
        return []

def save_products(products_list):
    with open(PRODUCTS_FILE, "w", encoding="utf-8") as f:
        json.dump(products_list, f, ensure_ascii=False, indent=2)
    # Also sync data/parsed_products.json for compatibility
    parsed_path = os.path.join(DATA_DIR, "parsed_products.json")
    try:
        with open(parsed_path, "w", encoding="utf-8") as f:
            json.dump(products_list, f, ensure_ascii=False, indent=2)
    except Exception as e:
        print(f"[WARN] Could not sync parsed_products.json: {e}")

def load_categories():
    if not os.path.exists(CATEGORIES_FILE):
        return []
    try:
        with open(CATEGORIES_FILE, "r", encoding="utf-8") as f:
            return json.load(f).get("categories", [])
    except Exception as e:
        print(f"[ERROR] Failed to read {CATEGORIES_FILE}: {e}")
        return []

def run_auto_generate_background():
    """Runs catalog generator in background thread to avoid blocking request."""
    def _task():
        with generation_lock:
            try:
                gen = CatalogGenerator(root_dir=root_dir)
                gen.generate_all()
                print("[AUTO-GEN] Catalogs successfully regenerated in background.")
            except Exception as e:
                print(f"[AUTO-GEN ERROR] Failed to regenerate catalogs: {e}")
    t = threading.Thread(target=_task, daemon=True)
    t.start()

# ----------------- Pydantic Models -----------------

class ProductCreate(BaseModel):
    ar: str
    en: str
    price: str
    category_id: int
    usage_type: Optional[str] = "other"
    image: Optional[str] = "Branding/logo-100.png"

class ProductUpdate(BaseModel):
    ar: Optional[str] = None
    en: Optional[str] = None
    price: Optional[str] = None
    category_id: Optional[int] = None
    usage_type: Optional[str] = None
    image: Optional[str] = None

class AdminAuthRequest(BaseModel):
    pin: str

# ----------------- Page Routes -----------------

@app.get("/", response_class=HTMLResponse)
async def serve_customer_catalog():
    """Serves customer modern responsive web catalog."""
    idx_path = os.path.join(os.path.dirname(__file__), "templates", "index.html")
    if os.path.exists(idx_path):
        return FileResponse(idx_path)
    # fallback to root index.html
    return FileResponse(os.path.join(root_dir, "index.html"))

@app.get("/admin", response_class=HTMLResponse)
async def serve_admin_dashboard():
    """Serves private admin dashboard."""
    admin_path = os.path.join(os.path.dirname(__file__), "templates", "admin.html")
    return FileResponse(admin_path)

@app.get("/printed_catalogs.html", response_class=HTMLResponse)
async def serve_printed_center():
    return FileResponse(os.path.join(root_dir, "printed_catalogs.html"))

@app.get("/catalog_ar.html", response_class=HTMLResponse)
async def serve_catalog_ar():
    return FileResponse(os.path.join(root_dir, "catalog_ar.html"))

@app.get("/catalog_en.html", response_class=HTMLResponse)
async def serve_catalog_en():
    return FileResponse(os.path.join(root_dir, "catalog_en.html"))

@app.get("/catalog_en_branded.html", response_class=HTMLResponse)
async def serve_catalog_branded():
    return FileResponse(os.path.join(root_dir, "catalog_en_branded.html"))

# ----------------- API Endpoints -----------------

@app.post("/api/admin/login")
async def admin_login(payload: AdminAuthRequest):
    if payload.pin.strip() == ADMIN_PIN:
        return {"success": True, "token": "admin-session-woa-2026", "message": "تم تسجيل الدخول بنجاح"}
    raise HTTPException(status_code=401, detail="رمز الدخول (PIN) غير صحيح")

@app.get("/api/categories")
async def get_categories():
    categories = load_categories()
    products = load_products()
    
    # Calculate live counts
    counts = {}
    for p in products:
        cid = p.get("category_id", 1)
        counts[cid] = counts.get(cid, 0) + 1
        
    for cat in categories:
        cat["live_count"] = counts.get(cat["id"], 0)
        
    return {"categories": categories, "total_products": len(products)}

@app.get("/api/usage-types")
async def get_usage_types():
    products = load_products()
    counts = {"kitchen": 0, "dressing": 0, "other": 0}
    for p in products:
        u = p.get("usage_type", "other")
        counts[u] = counts.get(u, 0) + 1
    return {
        "types": [
            {"key": "kitchen", "ar": "مطابخ", "en": "Kitchen", "icon": "🍳", "count": counts.get("kitchen", 0)},
            {"key": "dressing", "ar": "دريسينج", "en": "Dressing", "icon": "👔", "count": counts.get("dressing", 0)},
            {"key": "other", "ar": "أخرى وعام", "en": "Other", "icon": "🛋️", "count": counts.get("other", 0)}
        ],
        "total": len(products)
    }

@app.get("/api/products")
async def get_products(
    search: Optional[str] = None,
    category_id: Optional[int] = None,
    usage_type: Optional[str] = None,
    sort: Optional[str] = "id_asc",
    page: int = 1,
    limit: int = 50
):
    products = load_products()
    
    # Filtering by category
    if category_id and category_id > 0:
        products = [p for p in products if p.get("category_id") == category_id]

    # Filtering by usage type (kitchen / dressing / other)
    if usage_type and usage_type != "all":
        products = [p for p in products if p.get("usage_type") == usage_type]
        
    if search:
        q = search.lower().strip()
        def matches(p):
            return (
                q in str(p.get("id", "")).lower() or
                q in p.get("ar", "").lower() or
                q in p.get("en", "").lower() or
                q in str(p.get("price", "")).lower() or
                q in p.get("usage_ar", "").lower() or
                q in p.get("usage_en", "").lower()
            )
        products = [p for p in products if matches(p)]
        
    # Sorting
    if sort == "price_asc":
        products.sort(key=lambda p: float(p.get("price", 0) or 0))
    elif sort == "price_desc":
        products.sort(key=lambda p: float(p.get("price", 0) or 0), reverse=True)
    elif sort == "id_desc":
        products.sort(key=lambda p: int(p.get("id", 0) or 0), reverse=True)
    else:  # id_asc
        products.sort(key=lambda p: int(p.get("id", 0) or 0))
        
    total = len(products)
    start = (page - 1) * limit
    paginated = products[start:start + limit]
    
    return {
        "total": total,
        "page": page,
        "limit": limit,
        "pages": max(1, (total + limit - 1) // limit),
        "products": paginated
    }

@app.get("/api/products/{product_id}")
async def get_single_product(product_id: int):
    products = load_products()
    for p in products:
        if p.get("id") == product_id or p.get("n") == product_id:
            return p
    raise HTTPException(status_code=404, detail="المنتج غير موجود")

@app.post("/api/products")
async def create_product(product: ProductCreate):
    products = load_products()
    new_id = max([p.get("id", 0) for p in products] + [0]) + 1
    now_iso = datetime.now().isoformat()
    
    u_key = product.usage_type or "other"
    u_map = {
        "kitchen": ("مطابخ", "Kitchen"),
        "dressing": ("دريسينج", "Dressing"),
        "other": ("أخرى", "Other")
    }
    u_ar, u_en = u_map.get(u_key, ("أخرى", "Other"))

    new_item = {
        "id": new_id,
        "n": new_id,
        "ar": product.ar.strip(),
        "en": product.en.strip(),
        "price": str(product.price).strip(),
        "category_id": product.category_id,
        "usage_type": u_key,
        "usage_ar": u_ar,
        "usage_en": u_en,
        "image": product.image or "Branding/logo-100.png",
        "created_at": now_iso,
        "updated_at": now_iso
    }
    
    products.append(new_item)
    save_products(products)
    
    # Auto-regenerate catalogs in background
    run_auto_generate_background()
    
    return {"success": True, "product": new_item, "message": "تمت إضافة المنتج وإطلاق التوليد التلقائي للكتالوج"}

@app.put("/api/products/{product_id}")
async def update_product(product_id: int, updates: ProductUpdate):
    products = load_products()
    found = False
    updated_item = None
    
    u_map = {
        "kitchen": ("مطابخ", "Kitchen"),
        "dressing": ("دريسينج", "Dressing"),
        "other": ("أخرى", "Other")
    }

    for p in products:
        if p.get("id") == product_id or p.get("n") == product_id:
            if updates.ar is not None:
                p["ar"] = updates.ar.strip()
            if updates.en is not None:
                p["en"] = updates.en.strip()
            if updates.price is not None:
                p["price"] = str(updates.price).strip()
            if updates.category_id is not None:
                p["category_id"] = updates.category_id
            if updates.usage_type is not None:
                p["usage_type"] = updates.usage_type
                u_ar, u_en = u_map.get(updates.usage_type, ("أخرى", "Other"))
                p["usage_ar"] = u_ar
                p["usage_en"] = u_en
            if updates.image is not None:
                p["image"] = updates.image
            p["updated_at"] = datetime.now().isoformat()
            updated_item = p
            found = True
            break
            
    if not found:
        raise HTTPException(status_code=404, detail="المنتج غير موجود")
        
    save_products(products)
    
    # Auto-regenerate catalogs in background
    run_auto_generate_background()
    
    return {"success": True, "product": updated_item, "message": "تم تحديث المنتج وإطلاق التوليد التلقائي للكتالوج"}

@app.delete("/api/products/{product_id}")
async def delete_product(product_id: int):
    products = load_products()
    initial_len = len(products)
    products = [p for p in products if p.get("id") != product_id and p.get("n") != product_id]
    
    if len(products) == initial_len:
        raise HTTPException(status_code=404, detail="المنتج غير موجود")
        
    save_products(products)
    
    # Auto-regenerate catalogs in background
    run_auto_generate_background()
    
    return {"success": True, "message": "تم حذف المنتج وإطلاق التوليد التلقائي للكتالوج"}

@app.post("/api/upload")
async def upload_product_image(file: UploadFile = File(...)):
    """Upload product image and save into assets/products/."""
    valid_exts = [".jpg", ".jpeg", ".png", ".webp"]
    _, ext = os.path.splitext(file.filename)
    ext = ext.lower()
    
    if ext not in valid_exts:
        raise HTTPException(status_code=400, detail="نوع الملف غير مدعوم. يرجى رفع صورة (JPG, PNG, WEBP)")
        
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    clean_name = f"prod_{timestamp}{ext}"
    target_path = os.path.join(UPLOAD_DIR, clean_name)
    
    with open(target_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    relative_path = f"assets/products/{clean_name}"
    return {"success": True, "url": relative_path, "filename": clean_name}

@app.post("/api/generate-catalogs")
async def trigger_generate_catalogs():
    """Manual on-demand trigger to regenerate all catalogs."""
    try:
        gen = CatalogGenerator(root_dir=root_dir)
        status = gen.generate_all()
        return {"success": True, "result": status, "message": "تم توليد كافة الكتالوجات بنجاح"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"حدث خطأ أثناء توليد الكتالوجات: {str(e)}")

@app.get("/api/generator-status")
async def get_generator_status():
    if os.path.exists(STATUS_FILE):
        try:
            with open(STATUS_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            pass
    return {"status": "ready", "last_generated_at": None, "products_count": len(load_products())}

# ----------------- Static Mounts -----------------

static_dir = os.path.join(os.path.dirname(__file__), "static")
if os.path.exists(static_dir):
    app.mount("/static", StaticFiles(directory=static_dir), name="static")

app.mount("/assets", StaticFiles(directory=os.path.join(root_dir, "assets")), name="assets")
app.mount("/Branding", StaticFiles(directory=os.path.join(root_dir, "Branding")), name="Branding")
app.mount("/styles", StaticFiles(directory=os.path.join(root_dir, "styles")), name="styles")
app.mount("/Categories", StaticFiles(directory=os.path.join(root_dir, "Categories")), name="Categories")

if __name__ == "__main__":
    import uvicorn
    print("\n🌟 World of Accessories Server starting on http://localhost:8080 ...")
    uvicorn.run("web_catalog.server:app", host="0.0.0.0", port=8080, reload=False)
