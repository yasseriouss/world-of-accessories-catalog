"""
Catalog Generator Module - Official Print & A4 PDF Generator
Supports generating:
1. Arabic Complete Catalog (catalog_ar.html)
2. English Complete Catalog (catalog_en.html)
3. Specialized Category Booklets (Categories/category_01..10)
4. Categories Navigation Indexes (Categories/categories_index_*)
"""

from .generator import CatalogGenerator

__all__ = ["CatalogGenerator"]
