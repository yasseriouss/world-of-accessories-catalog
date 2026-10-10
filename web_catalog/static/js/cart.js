/**
 * World of Accessories - Client Shopping Cart & WhatsApp Order Engine
 * High Performance, Secure (XSS Sanitized), Persistent (localStorage),
 * Full Bilingual Support (AR/EN), Smooth Slide-Over Drawer & Quotation Generator.
 */

(function () {
    'use strict';

    // Safe HTML Escape to eliminate XSS
    function escapeHTML(str) {
        if (str === null || str === undefined) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    const STORAGE_KEY = 'woa_customer_cart_v1';
    const PHONE_NUMBER = '201140030036';

    const CART_I18N = {
        ar: {
            cartTitle: "سلة مشترياتي",
            itemsCount: "منتجات",
            itemSingular: "منتج",
            emptyTitle: "سلة المشتريات فارغة",
            emptyDesc: "تصفح كتالوج المنتجات الفاخرة وأضف ما يناسبك إلى السلة بنقرة واحدة.",
            startShopping: "تصفح المنتجات الآن",
            subtotal: "إجمالي المنتجات:",
            total: "المجموع الكلي المعتمد:",
            currency: "ج.م",
            whatsappOrder: "إرسال الطلب عبر واتساب 💬",
            quotationBtn: "طباعة عرض أسعار رسمي 📄",
            clearCart: "تفريغ السلة بالكامل",
            clearConfirm: "هل أنت متأكد من تفريغ كافة المنتجات من السلة؟",
            addedToast: "تمت إضافة المنتج إلى السلة بنجاح 🛒",
            code: "الكود:",
            qty: "الكمية",
            price: "السعر"
        },
        en: {
            cartTitle: "Shopping Cart",
            itemsCount: "items",
            itemSingular: "item",
            emptyTitle: "Your Cart is Empty",
            emptyDesc: "Browse our premium hardware catalog and add your items with a single tap.",
            startShopping: "Browse Catalog Now",
            subtotal: "Items Subtotal:",
            total: "Grand Total:",
            currency: "EGP",
            whatsappOrder: "Order via WhatsApp 💬",
            quotationBtn: "Print Official Quotation 📄",
            clearCart: "Clear Shopping Cart",
            clearConfirm: "Are you sure you want to empty the shopping cart?",
            addedToast: "Item added to cart successfully 🛒",
            code: "SKU:",
            qty: "Qty",
            price: "Price"
        }
    };

    class CartService {
        constructor() {
            this.items = this.loadCart();
            this.isOpen = false;
            this.lang = this.detectLanguage();
            this.initDOM();
            this.bindEvents();
            this.updateBadge();
        }

        detectLanguage() {
            const docLang = document.documentElement.getAttribute('lang') || 'ar';
            return docLang === 'en' ? 'en' : 'ar';
        }

        getT() {
            this.lang = this.detectLanguage();
            return CART_I18N[this.lang] || CART_I18N.ar;
        }

        loadCart() {
            try {
                const data = localStorage.getItem(STORAGE_KEY);
                return data ? JSON.parse(data) : [];
            } catch (e) {
                console.warn('[WOACart] Could not parse stored cart:', e);
                return [];
            }
        }

        saveCart() {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items));
            } catch (e) {
                console.error('[WOACart] Failed to persist cart to localStorage:', e);
            }
            this.updateBadge();
            if (this.isOpen) {
                this.renderDrawer();
            }
        }

        // Add or increment item in cart
        addItem(product, qty = 1) {
            if (!product) return;
            const id = Number(product.id || product.n);
            if (!id) return;

            const existing = this.items.find(item => item.id === id);
            const numQty = Math.max(1, parseInt(qty, 10) || 1);

            // Clean price parsing
            let rawPrice = product.price;
            if (typeof rawPrice === 'string') {
                rawPrice = rawPrice.replace(/[^\d.]/g, '');
            }
            const unitPrice = parseFloat(rawPrice) || 0;

            if (existing) {
                existing.qty += numQty;
            } else {
                const code = `WOA-${String(id).padStart(4, '0')}`;
                this.items.push({
                    id: id,
                    code: code,
                    ar: product.ar || product.titleAr || product.name || 'منتج إكسسوارات',
                    en: product.en || product.titleEn || product.nameEn || 'Hardware Product',
                    price: unitPrice,
                    qty: numQty,
                    image: product.image || product.img || 'Branding/logo-100.png',
                    category: product.category_id || 0,
                    usage: product.usage_type || 'other'
                });
            }

            this.saveCart();
            this.triggerBadgePulse();
            this.showToast();
        }

        removeItem(id) {
            this.items = this.items.filter(item => item.id !== Number(id));
            this.saveCart();
        }

        updateQty(id, delta) {
            const item = this.items.find(i => i.id === Number(id));
            if (!item) return;

            item.qty += delta;
            if (item.qty <= 0) {
                this.removeItem(id);
            } else {
                this.saveCart();
            }
        }

        clearCart() {
            const t = this.getT();
            if (this.items.length === 0) return;
            if (confirm(t.clearConfirm)) {
                this.items = [];
                this.saveCart();
            }
        }

        getTotalCount() {
            return this.items.reduce((sum, item) => sum + (item.qty || 1), 0);
        }

        getTotalPrice() {
            return this.items.reduce((sum, item) => sum + ((item.price || 0) * (item.qty || 1)), 0);
        }

        // Update Floating Trigger Badge
        updateBadge() {
            const badge = document.getElementById('woaCartBadge');
            const total = this.getTotalCount();
            if (badge) {
                badge.textContent = total;
                badge.style.display = total > 0 ? 'block' : 'none';
            }
        }

        triggerBadgePulse() {
            const badge = document.getElementById('woaCartBadge');
            if (badge) {
                badge.classList.remove('pulse');
                void badge.offsetWidth; // reflow
                badge.classList.add('pulse');
            }
        }

        showToast() {
            const toast = document.getElementById('woaCartToast');
            const t = this.getT();
            if (toast) {
                toast.textContent = t.addedToast;
                toast.classList.add('show');
                setTimeout(() => toast.classList.remove('show'), 2200);
            }
        }

        // Open & Close Drawer
        open() {
            this.isOpen = true;
            this.renderDrawer();
            const overlay = document.getElementById('woaCartOverlay');
            if (overlay) {
                overlay.classList.add('open');
                document.body.style.overflow = 'hidden';
            }
            // Push history state to handle mobile back button
            try {
                history.pushState({ woaCartOpen: true }, '');
            } catch (e) {}
        }

        close() {
            this.isOpen = false;
            const overlay = document.getElementById('woaCartOverlay');
            if (overlay) {
                overlay.classList.remove('open');
                document.body.style.overflow = '';
            }
        }

        // Render Drawer Content
        renderDrawer() {
            const t = this.getT();
            const isAr = this.lang === 'ar';
            const count = this.getTotalCount();
            const total = this.getTotalPrice();

            const titleEl = document.getElementById('woaCartDrawerTitle');
            if (titleEl) titleEl.textContent = t.cartTitle;

            const badgeEl = document.getElementById('woaCartDrawerBadge');
            if (badgeEl) badgeEl.textContent = `${count} ${count === 1 ? t.itemSingular : t.itemsCount}`;

            const bodyEl = document.getElementById('woaCartBody');
            const footerEl = document.getElementById('woaCartFooter');

            if (!bodyEl) return;

            if (this.items.length === 0) {
                bodyEl.innerHTML = `
                    <div class="woa-cart-empty">
                        <div class="woa-cart-empty-icon">🛒</div>
                        <h4>${escapeHTML(t.emptyTitle)}</h4>
                        <p>${escapeHTML(t.emptyDesc)}</p>
                        <button type="button" class="woa-cart-empty-btn" onclick="WOACart.close()">${escapeHTML(t.startShopping)}</button>
                    </div>
                `;
                if (footerEl) footerEl.style.display = 'none';
                return;
            }

            if (footerEl) footerEl.style.display = 'block';

            let itemsHTML = '';
            this.items.forEach(item => {
                const name = isAr ? item.ar : (item.en || item.ar);
                const itemTotal = (item.price * item.qty).toLocaleString();
                const unitPrice = item.price.toLocaleString();
                const img = item.image.startsWith('/') || item.image.startsWith('http') ? item.image : `/${item.image}`;

                itemsHTML += `
                    <div class="woa-cart-item">
                        <div class="woa-cart-item-img">
                            <img src="${escapeHTML(img)}" alt="${escapeHTML(name)}" loading="lazy">
                        </div>
                        <div class="woa-cart-item-info">
                            <span class="woa-cart-item-sku">${escapeHTML(item.code)}</span>
                            <div class="woa-cart-item-title" title="${escapeHTML(name)}">${escapeHTML(name)}</div>
                            <div class="woa-cart-item-price-row">
                                <span class="woa-cart-item-unit-price">${unitPrice} ${t.currency}</span>
                                <span style="color:#CBD5E1;">&bull;</span>
                                <span class="woa-cart-item-total-price">${itemTotal} ${t.currency}</span>
                            </div>
                        </div>
                        <div class="woa-cart-qty-ctrl">
                            <button type="button" class="woa-cart-qty-btn" onclick="WOACart.updateQty(${item.id}, -1)">−</button>
                            <span class="woa-cart-qty-val">${item.qty}</span>
                            <button type="button" class="woa-cart-qty-btn" onclick="WOACart.updateQty(${item.id}, 1)">+</button>
                        </div>
                        <button type="button" class="woa-cart-item-remove-btn" title="حذف" onclick="WOACart.removeItem(${item.id})">🗑️</button>
                    </div>
                `;
            });

            bodyEl.innerHTML = itemsHTML;

            // Summary in footer
            const totalItemsEl = document.getElementById('woaCartSummaryItems');
            if (totalItemsEl) totalItemsEl.textContent = `${count} ${count === 1 ? t.itemSingular : t.itemsCount}`;

            const totalAmountEl = document.getElementById('woaCartSummaryAmount');
            if (totalAmountEl) totalAmountEl.textContent = `${total.toLocaleString()} ${t.currency}`;
        }

        // Format & Send WhatsApp Message
        checkoutWhatsApp() {
            if (this.items.length === 0) return;
            const t = this.getT();
            const isAr = this.lang === 'ar';
            const count = this.getTotalCount();
            const total = this.getTotalPrice().toLocaleString();

            let msg = isAr
                ? `*طلب جديد من كتالوج عالم الإكسسوارات* 🌟\n`
                : `*New Order from World of Accessories Catalog* 🌟\n`;

            msg += `------------------------------------\n`;

            this.items.forEach((item, index) => {
                const name = isAr ? item.ar : (item.en || item.ar);
                const itemTotal = (item.price * item.qty).toLocaleString();
                msg += `${index + 1}. *${name}*\n`;
                msg += `   • الكود: ${item.code}\n`;
                msg += `   • الكمية: ${item.qty} | السعر: ${item.price} ج.م | الإجمالي: ${itemTotal} ج.م\n`;
            });

            msg += `------------------------------------\n`;
            msg += `💰 *إجمالي قيمة الطلب:* ${total} ج.م\n`;
            msg += `📦 *إجمالي عدد القطع:* ${count}\n`;
            msg += `📍 *المقر:* مدينة 6 أكتوبر – سيلا مول\n`;
            msg += `يرجى تأكيد توفر الأصناف وإجراءات الاستلام أو التوصيل. شكراً لكم!`;

            const waUrl = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(msg)}`;
            window.open(waUrl, '_blank', 'noopener,noreferrer');
        }

        // Generate Print-Ready Formal Price Quotation
        printQuotation() {
            if (this.items.length === 0) return;
            const isAr = this.lang === 'ar';
            const dateStr = new Date().toLocaleDateString(isAr ? 'ar-EG' : 'en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            const quoteNum = `WOA-Q-${Date.now().toString().slice(-6)}`;
            const total = this.getTotalPrice().toLocaleString();
            const count = this.getTotalCount();

            let rows = '';
            this.items.forEach((item, i) => {
                const name = isAr ? item.ar : (item.en || item.ar);
                const itemTotal = (item.price * item.qty).toLocaleString();
                rows += `
                    <tr>
                        <td style="padding:10px; border-bottom:1px solid #E2E8F0; text-align:center;">${i + 1}</td>
                        <td style="padding:10px; border-bottom:1px solid #E2E8F0; font-weight:700;">${escapeHTML(item.code)}</td>
                        <td style="padding:10px; border-bottom:1px solid #E2E8F0;">${escapeHTML(name)}</td>
                        <td style="padding:10px; border-bottom:1px solid #E2E8F0; text-align:center;">${item.qty}</td>
                        <td style="padding:10px; border-bottom:1px solid #E2E8F0; text-align:right;">${item.price.toLocaleString()} ج.م</td>
                        <td style="padding:10px; border-bottom:1px solid #E2E8F0; text-align:right; font-weight:700;">${itemTotal} ج.م</td>
                    </tr>
                `;
            });

            const printHtml = `
                <!DOCTYPE html>
                <html lang="${this.lang}" dir="${isAr ? 'rtl' : 'ltr'}">
                <head>
                    <meta charset="UTF-8">
                    <title>عرض أسعار رسمي - عالم الإكسسوارات ${quoteNum}</title>
                    <style>
                        body { font-family: 'Tajawal', sans-serif, Arial; margin: 40px; color: #0F172A; }
                        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #1A3F7F; padding-bottom: 20px; margin-bottom: 24px; }
                        .brand h1 { margin: 0 0 4px; font-size: 22px; color: #1A3F7F; }
                        .brand p { margin: 0; color: #64748B; font-size: 13px; }
                        .meta { text-align: ${isAr ? 'left' : 'right'}; font-size: 13px; }
                        table { width: 100%; border-collapse: collapse; margin: 24px 0; font-size: 13px; }
                        th { background: #1A3F7F; color: #FFFFFF; padding: 12px 10px; text-align: ${isAr ? 'right' : 'left'}; }
                        th:first-child, th:nth-child(2), th:nth-child(4) { text-align: center; }
                        .total-box { margin-top: 20px; float: ${isAr ? 'left' : 'right'}; width: 300px; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 16px; }
                        .footer-note { clear: both; margin-top: 50px; padding-top: 20px; border-top: 1px solid #E2E8F0; font-size: 12px; color: #64748B; text-align: center; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <div class="brand">
                            <h1>عالم الإكسسوارات • World of Accessories</h1>
                            <p>المقر الرئيسي: مدينة 6 أكتوبر – المحور المركزي – سيلا مول | هاتف: 01140030036</p>
                        </div>
                        <div class="meta">
                            <strong style="font-size:16px; color:#1A3F7F;">عرض أسعار رسمي</strong><br>
                            رقم العرض: ${quoteNum}<br>
                            التاريخ: ${dateStr}
                        </div>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th style="width:50px;">م</th>
                                <th style="width:110px;">كود الصنف</th>
                                <th>اسم الصنف والمواصفات</th>
                                <th style="width:70px;">الكمية</th>
                                <th style="width:110px;">سعر الوحدة</th>
                                <th style="width:120px;">الإجمالي</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${rows}
                        </tbody>
                    </table>

                    <div class="total-box">
                        <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:13px;">
                            <span>إجمالي عدد القطع:</span>
                            <strong>${count} قطعة</strong>
                        </div>
                        <div style="display:flex; justify-content:space-between; font-size:16px; font-weight:800; color:#1A3F7F; border-top:1px dashed #CBD5E1; padding-top:8px;">
                            <span>المجموع الكلي:</span>
                            <span>${total} ج.م</span>
                        </div>
                    </div>

                    <div class="footer-note">
                        <p>هذا العرض صادر رسمياً من شركة عالم الإكسسوارات &bull; الأسعار سارية وفق المخزون المتاح &bull; Created by yasserious.com</p>
                    </div>

                    <script>
                        window.onload = function() { window.print(); };
                    <\/script>
                </body>
                </html>
            `;

            const win = window.open('', '_blank');
            if (win) {
                win.document.open();
                win.document.write(printHtml);
                win.document.close();
            }
        }

        // Initialize DOM markup dynamically if not present
        initDOM() {
            if (document.getElementById('woaFloatingCartBtn')) return;

            const t = this.getT();

            // 1. Floating Cart Trigger Button
            const floatBtn = document.createElement('button');
            floatBtn.type = 'button';
            floatBtn.id = 'woaFloatingCartBtn';
            floatBtn.className = 'woa-floating-cart-btn';
            floatBtn.title = t.cartTitle;
            floatBtn.setAttribute('aria-label', t.cartTitle);
            floatBtn.innerHTML = `
                🛒
                <span id="woaCartBadge" class="woa-cart-badge" style="display:none;">0</span>
            `;
            floatBtn.onclick = () => this.open();
            document.body.appendChild(floatBtn);

            // 2. Slide-Over Cart Drawer Markup
            const overlay = document.createElement('div');
            overlay.id = 'woaCartOverlay';
            overlay.className = 'woa-cart-overlay';
            overlay.innerHTML = `
                <div class="woa-cart-drawer" role="dialog" aria-modal="true" aria-labelledby="woaCartDrawerTitle">
                    <div class="woa-cart-header">
                        <div class="woa-cart-header-title">
                            <span style="font-size:22px;">🛒</span>
                            <h3 id="woaCartDrawerTitle">${escapeHTML(t.cartTitle)}</h3>
                            <span id="woaCartDrawerBadge" class="woa-cart-header-badge">0 ${escapeHTML(t.itemsCount)}</span>
                        </div>
                        <button type="button" class="woa-cart-close-btn" id="woaCartCloseBtn" aria-label="Close" onclick="WOACart.close()">✕</button>
                    </div>

                    <div class="woa-cart-body" id="woaCartBody"></div>

                    <div class="woa-cart-footer" id="woaCartFooter" style="display:none;">
                        <div class="woa-cart-summary-row">
                            <span>${escapeHTML(t.subtotal)}</span>
                            <strong id="woaCartSummaryItems">0</strong>
                        </div>
                        <div class="woa-cart-summary-total">
                            <span>${escapeHTML(t.total)}</span>
                            <span class="total-amount" id="woaCartSummaryAmount">0 ${t.currency}</span>
                        </div>
                        <div class="woa-cart-actions">
                            <button type="button" class="woa-btn-whatsapp-order" onclick="WOACart.checkoutWhatsApp()">
                                <span>💬</span>
                                <span>${escapeHTML(t.whatsappOrder)}</span>
                            </button>
                            <button type="button" class="woa-btn-quotation" onclick="WOACart.printQuotation()">
                                <span>📄</span>
                                <span>${escapeHTML(t.quotationBtn)}</span>
                            </button>
                            <div class="woa-cart-clear-link">
                                <button type="button" onclick="WOACart.clearCart()">${escapeHTML(t.clearCart)}</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(overlay);

            // 3. Toast element
            const toast = document.createElement('div');
            toast.id = 'woaCartToast';
            toast.className = 'woa-cart-toast';
            toast.textContent = t.addedToast;
            document.body.appendChild(toast);
        }

        bindEvents() {
            // Close on overlay backdrop click
            const overlay = document.getElementById('woaCartOverlay');
            if (overlay) {
                overlay.addEventListener('click', (e) => {
                    if (e.target === overlay) {
                        this.close();
                    }
                });
            }

            // Close on Escape key
            window.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isOpen) {
                    this.close();
                }
            });

            // Handle browser Back button popstate
            window.addEventListener('popstate', (e) => {
                if (this.isOpen) {
                    this.close();
                }
            });
        }
    }

    // Instantiate and expose globally
    document.addEventListener('DOMContentLoaded', () => {
        window.WOACart = new CartService();
    });

    // Immediate fallback if script loaded after DOMContentLoaded
    if (document.readyState === 'interactive' || document.readyState === 'complete') {
        if (!window.WOACart) {
            window.WOACart = new CartService();
        }
    }

})();
