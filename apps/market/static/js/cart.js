/**
 * World of Accessories - Client Shopping Cart & Complete Checkout Engine
 * Full E-Commerce Flow: Cart Review -> Customer Info & Address Form -> Order Confirmation & WhatsApp Sync.
 * High Performance, Secure (XSS Sanitized), Persistent (localStorage),
 * Full Bilingual Support (AR/EN), Smooth Slide-Over Drawer & Quotation/Invoice Generator.
 */

(function () {
    'use strict';

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
    const CUSTOMER_STORAGE_KEY = 'woa_customer_info_v1';
    const LAST_ORDER_KEY = 'woa_last_order_v1';
    const PHONE_NUMBER = '201140030036';

    const GOVERNORATES = [
        { ar: "القاهرة", en: "Cairo" },
        { ar: "الجيزة", en: "Giza" },
        { ar: "الإسكندرية", en: "Alexandria" },
        { ar: "القليوبية", en: "Qalyubia" },
        { ar: "الدقهلية", en: "Dakahlia" },
        { ar: "الشرقية", en: "Sharqia" },
        { ar: "الغربية", en: "Gharbia" },
        { ar: "المنوفية", en: "Monufia" },
        { ar: "البحيرة", en: "Beheira" },
        { ar: "دمياط", en: "Damietta" },
        { ar: "كفر الشيخ", en: "Kafr El Sheikh" },
        { ar: "بورسعيد", en: "Port Said" },
        { ar: "الإسماعيلية", en: "Ismailia" },
        { ar: "السويس", en: "Suez" },
        { ar: "بني سويف", en: "Beni Suef" },
        { ar: "الفيوم", en: "Fayoum" },
        { ar: "المنيا", en: "Minya" },
        { ar: "أسيوط", en: "Asyut" },
        { ar: "سوهاج", en: "Sohag" },
        { ar: "قنا", en: "Qena" },
        { ar: "الأقصر", en: "Luxor" },
        { ar: "أسوان", en: "Aswan" },
        { ar: "البحر الأحمر", en: "Red Sea" },
        { ar: "مطروح", en: "Matrouh" },
        { ar: "الوادي الجديد", en: "New Valley" },
        { ar: "شمال سيناء", en: "North Sinai" },
        { ar: "جنوب سيناء", en: "South Sinai" }
    ];

    const CART_I18N = {
        ar: {
            cartTitle: "سلة مشترياتي",
            checkoutTitle: "بيانات العميل والشحن",
            confirmedTitle: "تأكيد واستلام الطلب",
            step1: "السلة",
            step2: "بيانات الشحن",
            step3: "تأكيد الطلب",
            backToCart: "← العودة لمراجعة السلة",
            itemsCount: "منتجات",
            itemSingular: "منتج",
            emptyTitle: "سلة المشتريات فارغة",
            emptyDesc: "تصفح كتالوج المنتجات الفاخرة وأضف ما يناسبك إلى السلة بنقرة واحدة.",
            startShopping: "تصفح المنتجات الآن",
            subtotal: "إجمالي المنتجات:",
            total: "المجموع الكلي المعتمد:",
            currency: "ج.م",
            proceedCheckout: "متابعة إتمام الطلب والشحن 🛍️",
            quickWhatsapp: "طلب سريع عبر واتساب 💬",
            quotationBtn: "طباعة عرض أسعار رسمي 📄",
            clearCart: "تفريغ السلة بالكامل",
            clearConfirm: "هل أنت متأكد من تفريغ كافة المنتجات من السلة؟",
            addedToast: "تمت إضافة المنتج إلى السلة بنجاح 🛒",
            fullName: "الاسم بالكامل",
            fullNamePh: "أدخل اسمك الكريم أو اسم الورشة / المعرض",
            phone: "رقم الهاتف المحمول",
            phonePh: "01xxxxxxxxx (11 رقماً)",
            phoneAlt: "رقم هاتف إضافي / واتساب (اختياري)",
            governorate: "المحافظة",
            govSelect: "اختر المحافظة للتوصيل",
            address: "العنوان بالتفصيل",
            addressPh: "المدينة / الحي، اسم الشارع، رقم العقار أو المعرض",
            notes: "ملاحظات إضافية أو علامة مميزة (اختياري)",
            notesPh: "مثال: الاتصال قبل الوصول، مواعيد استلام محددة...",
            paymentMethod: "طريقة الدفع",
            codTitle: "الدفع عند الاستلام والمعاينة",
            codDesc: "معاينة المنتجات وفحص الجودة عند الاستلام قبل السداد",
            confirmBtn: "تأكيد وتسجيل الطلب الآن 🚀",
            errName: "يرجى إدخال الاسم بالكامل",
            errPhone: "يرجى إدخال رقم هاتف محمول صحيح (11 رقماً يبدأ بـ 01)",
            errGov: "يرجى اختيار المحافظة",
            errAddress: "يرجى إدخال العنوان بالتفصيل",
            successOrderTitle: "تم تسجيل وتأكيد طلبك بنجاح! 🎉",
            successOrderDesc: "شكراً لثقتكم بعالم الإكسسوارات. تم حفظ طلبك وسيقوم فريق المبيعات بالتواصل معكم للمعاينة والتنسيق.",
            orderIdLabel: "رقم الطلب الرسمي:",
            sendWaOrderNow: "إرسال نسخة الطلب للواتساب فوراً 💬",
            printInvoiceBtn: "طباعة فاتورة وإيصال الطلب 📄",
            continueShoppingBtn: "متابعة تصفح الكتالوج 🛒"
        },
        en: {
            cartTitle: "Shopping Cart",
            checkoutTitle: "Customer & Shipping Details",
            confirmedTitle: "Order Confirmation",
            step1: "Cart",
            step2: "Shipping",
            step3: "Confirmation",
            backToCart: "← Back to Cart",
            itemsCount: "items",
            itemSingular: "item",
            emptyTitle: "Your Cart is Empty",
            emptyDesc: "Browse our premium hardware catalog and add items to your cart with a single tap.",
            startShopping: "Browse Catalog Now",
            subtotal: "Items Subtotal:",
            total: "Grand Total:",
            currency: "EGP",
            proceedCheckout: "Proceed to Checkout 🛍️",
            quickWhatsapp: "Quick WhatsApp Order 💬",
            quotationBtn: "Print Official Quotation 📄",
            clearCart: "Clear Shopping Cart",
            clearConfirm: "Are you sure you want to empty the shopping cart?",
            addedToast: "Item added to cart successfully 🛒",
            fullName: "Full Name",
            fullNamePh: "Enter your full name or company / workshop name",
            phone: "Mobile Phone Number",
            phonePh: "01xxxxxxxxx (11 digits)",
            phoneAlt: "Secondary Phone / WhatsApp (Optional)",
            governorate: "Governorate",
            govSelect: "Select Delivery Governorate",
            address: "Detailed Delivery Address",
            addressPh: "City / District, Street Name, Building or Workshop No.",
            notes: "Special Notes / Landmark (Optional)",
            notesPh: "e.g. Call before delivery, delivery time preferences...",
            paymentMethod: "Payment Method",
            codTitle: "Cash on Delivery & Inspection",
            codDesc: "Inspect quality and hardware fittings upon delivery before payment",
            confirmBtn: "Confirm & Place Order Now 🚀",
            errName: "Please enter your full name",
            errPhone: "Please enter a valid 11-digit mobile number starting with 01",
            errGov: "Please select a governorate",
            errAddress: "Please enter detailed delivery address",
            successOrderTitle: "Your Order is Confirmed! 🎉",
            successOrderDesc: "Thank you for choosing World of Accessories. Your order has been placed and our sales team will contact you shortly.",
            orderIdLabel: "Official Order ID:",
            sendWaOrderNow: "Send Order Copy via WhatsApp 💬",
            printInvoiceBtn: "Print Formal Order Invoice 📄",
            continueShoppingBtn: "Continue Shopping 🛒"
        }
    };

    class CartService {
        constructor() {
            this.items = this.loadCart();
            this.customerData = this.loadCustomerData();
            this.lastOrder = this.loadLastOrder();
            this.currentStep = 'cart'; // 'cart', 'checkout', 'confirmed'
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
                return [];
            }
        }

        saveCart() {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items));
            } catch (e) {}
            this.updateBadge();
            if (this.isOpen) {
                this.renderDrawer();
            }
        }

        loadCustomerData() {
            try {
                const data = localStorage.getItem(CUSTOMER_STORAGE_KEY);
                return data ? JSON.parse(data) : {
                    name: '',
                    phone: '',
                    phoneAlt: '',
                    governorate: 'الجيزة',
                    address: '',
                    notes: ''
                };
            } catch (e) {
                return { name: '', phone: '', phoneAlt: '', governorate: 'الجيزة', address: '', notes: '' };
            }
        }

        saveCustomerData(data) {
            this.customerData = { ...this.customerData, ...data };
            try {
                localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(this.customerData));
            } catch (e) {}
        }

        loadLastOrder() {
            try {
                const data = localStorage.getItem(LAST_ORDER_KEY);
                return data ? JSON.parse(data) : null;
            } catch (e) {
                return null;
            }
        }

        addItem(product, qty = 1) {
            if (!product) return;
            const id = Number(product.id || product.n);
            if (!id) return;

            const existing = this.items.find(item => item.id === id);
            const numQty = Math.max(1, parseInt(qty, 10) || 1);

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
                    usage: product.usage_type || 'other',
                    color_ar: product.color_ar || '',
                    color_en: product.color_en || '',
                    length_ar: product.length_ar || '',
                    length_en: product.length_en || '',
                    specs_ar: product.specs_ar || '',
                    specs_en: product.specs_en || ''
                });
            }

            this.currentStep = 'cart';
            this.saveCart();
            this.triggerBadgePulse();
            this.showToast();
        }

        removeItem(id) {
            this.items = this.items.filter(item => item.id !== Number(id));
            if (this.items.length === 0 && this.currentStep === 'checkout') {
                this.currentStep = 'cart';
            }
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
                this.currentStep = 'cart';
                this.saveCart();
            }
        }

        getTotalCount() {
            return this.items.reduce((sum, item) => sum + (item.qty || 1), 0);
        }

        getTotalPrice() {
            return this.items.reduce((sum, item) => sum + ((item.price || 0) * (item.qty || 1)), 0);
        }

        // Update Both Floating and Header Badges
        updateBadge() {
            const total = this.getTotalCount();
            
            // 1. Floating Badge
            const floatBadge = document.getElementById('woaCartBadge');
            if (floatBadge) {
                floatBadge.textContent = total;
                floatBadge.style.display = total > 0 ? 'block' : 'none';
            }

            // 2. Header Badge
            const headerBadge = document.getElementById('woaHeaderCartBadge');
            if (headerBadge) {
                headerBadge.textContent = total;
                headerBadge.style.display = total > 0 ? 'inline-block' : 'none';
            }
        }

        triggerBadgePulse() {
            ['woaCartBadge', 'woaHeaderCartBadge'].forEach(id => {
                const el = document.getElementById(id);
                if (el) {
                    el.classList.remove('pulse');
                    void el.offsetWidth;
                    el.classList.add('pulse');
                }
            });
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

        open(step = null) {
            this.isOpen = true;
            if (step) this.currentStep = step;
            this.renderDrawer();
            const overlay = document.getElementById('woaCartOverlay');
            if (overlay) {
                overlay.classList.add('open');
                document.body.style.overflow = 'hidden';
            }
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

        setStep(step) {
            this.currentStep = step;
            this.renderDrawer();
        }

        // Render Drawer depending on Step
        renderDrawer() {
            const t = this.getT();
            const isAr = this.lang === 'ar';
            const count = this.getTotalCount();
            const total = this.getTotalPrice();

            const titleEl = document.getElementById('woaCartDrawerTitle');
            const badgeEl = document.getElementById('woaCartDrawerBadge');
            const stepsEl = document.getElementById('woaCartStepsNav');
            const bodyEl = document.getElementById('woaCartBody');
            const footerEl = document.getElementById('woaCartFooter');

            if (!bodyEl) return;

            // 1. Step Indicator
            if (stepsEl) {
                stepsEl.innerHTML = `
                    <div class="woa-step-item ${this.currentStep === 'cart' ? 'active' : (this.currentStep === 'checkout' || this.currentStep === 'confirmed' ? 'done' : '')}">
                        <span class="woa-step-num">${this.currentStep !== 'cart' ? '✓' : '1'}</span>
                        <span>${t.step1}</span>
                    </div>
                    <span>➔</span>
                    <div class="woa-step-item ${this.currentStep === 'checkout' ? 'active' : (this.currentStep === 'confirmed' ? 'done' : '')}">
                        <span class="woa-step-num">${this.currentStep === 'confirmed' ? '✓' : '2'}</span>
                        <span>${t.step2}</span>
                    </div>
                    <span>➔</span>
                    <div class="woa-step-item ${this.currentStep === 'confirmed' ? 'active done' : ''}">
                        <span class="woa-step-num">3</span>
                        <span>${t.step3}</span>
                    </div>
                `;
            }

            // ---------------- View: Confirmed ----------------
            if (this.currentStep === 'confirmed' && this.lastOrder) {
                if (titleEl) titleEl.textContent = t.confirmedTitle;
                if (badgeEl) badgeEl.textContent = `#${this.lastOrder.id}`;
                if (footerEl) footerEl.style.display = 'none';

                const o = this.lastOrder;
                bodyEl.innerHTML = `
                    <div class="woa-confirm-screen">
                        <div class="woa-success-badge">✓</div>
                        <h3 style="font-size:20px; font-weight:800; color:#0F172A; margin:0;">${escapeHTML(t.successOrderTitle)}</h3>
                        <p style="font-size:13px; color:#64748B; margin:0; line-height:1.6;">${escapeHTML(t.successOrderDesc)}</p>
                        
                        <div class="woa-order-id-badge">${escapeHTML(t.orderIdLabel)} #${escapeHTML(o.id)}</div>

                        <div class="woa-order-summary-box">
                            <div class="woa-order-summary-row">
                                <span>العميل / المؤسسة:</span>
                                <strong>${escapeHTML(o.customer.name)}</strong>
                            </div>
                            <div class="woa-order-summary-row">
                                <span>رقم الهاتف:</span>
                                <strong>${escapeHTML(o.customer.phone)}</strong>
                            </div>
                            <div class="woa-order-summary-row">
                                <span>المحافظة والعنوان:</span>
                                <span>${escapeHTML(o.customer.governorate)} – ${escapeHTML(o.customer.address)}</span>
                            </div>
                            <div class="woa-order-summary-row">
                                <span>إجمالي الأصناف (${o.totalCount} قطعة):</span>
                                <strong style="color:#1A3F7F; font-size:15px;">${o.totalPrice.toLocaleString()} ${t.currency}</strong>
                            </div>
                            <div class="woa-order-summary-row" style="border-bottom:none;">
                                <span>طريقة الدفع:</span>
                                <span style="color:#16A34A; font-weight:700;">💵 ${escapeHTML(t.codTitle)}</span>
                            </div>
                        </div>

                        <div style="width:100%; display:flex; flex-direction:column; gap:10px; margin-top:8px;">
                            <button type="button" class="woa-btn-whatsapp-order" onclick="WOACart.sendOrderWhatsApp('${o.id}')">
                                <span>💬</span>
                                <span>${escapeHTML(t.sendWaOrderNow)}</span>
                            </button>
                            <button type="button" class="woa-btn-quotation" onclick="WOACart.printOrderInvoice('${o.id}')">
                                <span>📄</span>
                                <span>${escapeHTML(t.printInvoiceBtn)}</span>
                            </button>
                            <button type="button" class="woa-btn-back-step" style="justify-content:center; margin-top:6px;" onclick="WOACart.resetAfterConfirmation()">
                                <span>🛒</span>
                                <span>${escapeHTML(t.continueShoppingBtn)}</span>
                            </button>
                        </div>
                    </div>
                `;
                return;
            }

            // ---------------- View: Checkout Form ----------------
            if (this.currentStep === 'checkout') {
                if (titleEl) {
                    titleEl.innerHTML = `
                        <button type="button" class="woa-btn-back-step" onclick="WOACart.setStep('cart')">${escapeHTML(t.backToCart)}</button>
                    `;
                }
                if (badgeEl) badgeEl.textContent = `${count} ${count === 1 ? t.itemSingular : t.itemsCount}`;
                if (footerEl) footerEl.style.display = 'none';

                const c = this.customerData;
                let govOptions = '';
                GOVERNORATES.forEach(g => {
                    const gName = isAr ? g.ar : g.en;
                    const isSelected = (c.governorate === g.ar || c.governorate === g.en);
                    govOptions += `<option value="${escapeHTML(gName)}" ${isSelected ? 'selected' : ''}>${escapeHTML(gName)}</option>`;
                });

                bodyEl.innerHTML = `
                    <form id="woaCheckoutForm" class="woa-checkout-form" onsubmit="event.preventDefault(); WOACart.handleOrderSubmit();">
                        <div class="woa-form-group">
                            <label class="woa-form-label">
                                <span>👤 ${escapeHTML(t.fullName)}</span>
                                <span class="req">*</span>
                            </label>
                            <input type="text" id="woaInputName" class="woa-form-input" required placeholder="${escapeHTML(t.fullNamePh)}" value="${escapeHTML(c.name)}">
                        </div>

                        <div class="woa-form-row-2">
                            <div class="woa-form-group">
                                <label class="woa-form-label">
                                    <span>📞 ${escapeHTML(t.phone)}</span>
                                    <span class="req">*</span>
                                </label>
                                <input type="tel" id="woaInputPhone" class="woa-form-input" required placeholder="${escapeHTML(t.phonePh)}" value="${escapeHTML(c.phone)}">
                            </div>
                            <div class="woa-form-group">
                                <label class="woa-form-label">
                                    <span>📱 ${escapeHTML(t.phoneAlt)}</span>
                                </label>
                                <input type="tel" id="woaInputPhoneAlt" class="woa-form-input" placeholder="01xxxxxxxxx" value="${escapeHTML(c.phoneAlt)}">
                            </div>
                        </div>

                        <div class="woa-form-group">
                            <label class="woa-form-label">
                                <span>📍 ${escapeHTML(t.governorate)}</span>
                                <span class="req">*</span>
                            </label>
                            <select id="woaSelectGov" class="woa-form-select" required>
                                ${govOptions}
                            </select>
                        </div>

                        <div class="woa-form-group">
                            <label class="woa-form-label">
                                <span>🏠 ${escapeHTML(t.address)}</span>
                                <span class="req">*</span>
                            </label>
                            <textarea id="woaInputAddress" class="woa-form-textarea" rows="2" required placeholder="${escapeHTML(t.addressPh)}">${escapeHTML(c.address)}</textarea>
                        </div>

                        <div class="woa-form-group">
                            <label class="woa-form-label">
                                <span>📝 ${escapeHTML(t.notes)}</span>
                            </label>
                            <input type="text" id="woaInputNotes" class="woa-form-input" placeholder="${escapeHTML(t.notesPh)}" value="${escapeHTML(c.notes)}">
                        </div>

                        <div class="woa-payment-method-card">
                            <div class="woa-payment-icon">💵</div>
                            <div class="woa-payment-info">
                                <strong>${escapeHTML(t.codTitle)}</strong>
                                <span>✓ ${escapeHTML(t.codDesc)}</span>
                            </div>
                        </div>

                        <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:10px; padding:12px; margin-top:4px;">
                            <div style="display:flex; justify-content:space-between; font-size:13px; margin-bottom:6px;">
                                <span>إجمالي الأصناف:</span>
                                <strong>${count} قطعة</strong>
                            </div>
                            <div style="display:flex; justify-content:space-between; font-size:16px; font-weight:800; color:#1A3F7F; border-top:1px dashed #CBD5E1; padding-top:6px;">
                                <span>المجموع الكلي:</span>
                                <span>${total.toLocaleString()} ${t.currency}</span>
                            </div>
                        </div>

                        <button type="submit" class="woa-btn-proceed-checkout" style="margin-top:6px;">
                            <span>${escapeHTML(t.confirmBtn)}</span>
                        </button>
                    </form>
                `;
                return;
            }

            // ---------------- View: Cart Items (Default) ----------------
            if (titleEl) titleEl.textContent = t.cartTitle;
            if (badgeEl) badgeEl.textContent = `${count} ${count === 1 ? t.itemSingular : t.itemsCount}`;

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
                        <div class="woa-cart-item-img img-shimmer-wrap">
                            <img src="${escapeHTML(img)}" alt="${escapeHTML(name)}" loading="lazy" decoding="async" onload="this.classList.add('loaded'); this.parentElement.classList.add('loaded');" onerror="this.onerror=null; this.src='/Branding/logo-80.png'; this.parentElement.classList.add('loaded', 'img-error'); this.classList.add('loaded');">
                        </div>
                        <div class="woa-cart-item-info">
                            <span class="woa-cart-item-sku">${escapeHTML(item.code)}</span>
                            <div class="woa-cart-item-title" title="${escapeHTML(name)}">${escapeHTML(name)}</div>
                            ${(item.color_ar || item.length_ar) ? `<div style="font-size:11px; color:#64748B; margin-bottom:2px;">🎨 ${escapeHTML(isAr ? (item.color_ar || '') : (item.color_en || item.color_ar || ''))} ${item.length_ar ? `• 📏 ${escapeHTML(isAr ? item.length_ar : (item.length_en || item.length_ar))}` : ''}</div>` : ''}
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

            const totalItemsEl = document.getElementById('woaCartSummaryItems');
            if (totalItemsEl) totalItemsEl.textContent = `${count} ${count === 1 ? t.itemSingular : t.itemsCount}`;

            const totalAmountEl = document.getElementById('woaCartSummaryAmount');
            if (totalAmountEl) totalAmountEl.textContent = `${total.toLocaleString()} ${t.currency}`;
        }

        // Handle Customer Order Submission
        handleOrderSubmit() {
            const t = this.getT();
            const name = document.getElementById('woaInputName')?.value.trim();
            const phone = document.getElementById('woaInputPhone')?.value.trim();
            const phoneAlt = document.getElementById('woaInputPhoneAlt')?.value.trim();
            const governorate = document.getElementById('woaSelectGov')?.value;
            const address = document.getElementById('woaInputAddress')?.value.trim();
            const notes = document.getElementById('woaInputNotes')?.value.trim();

            if (!name) {
                alert(t.errName);
                return;
            }
            if (!phone || phone.length < 10) {
                alert(t.errPhone);
                return;
            }
            if (!governorate) {
                alert(t.errGov);
                return;
            }
            if (!address) {
                alert(t.errAddress);
                return;
            }

            // Save customer profile for fast next checkout
            this.saveCustomerData({ name, phone, phoneAlt, governorate, address, notes });

            // Generate Order Object
            const orderId = `WOA-${Date.now().toString().slice(-4)}${Math.floor(100 + Math.random() * 900)}`;
            const order = {
                id: orderId,
                date: new Date().toISOString(),
                customer: { name, phone, phoneAlt, governorate, address, notes },
                items: [...this.items],
                totalCount: this.getTotalCount(),
                totalPrice: this.getTotalPrice()
            };

            this.lastOrder = order;
            try {
                localStorage.setItem(LAST_ORDER_KEY, JSON.stringify(order));
            } catch (e) {}

            // Empty cart after successful placement
            this.items = [];
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
            } catch (e) {}
            this.updateBadge();

            // Transition to confirmation screen
            this.currentStep = 'confirmed';
            this.renderDrawer();
        }

        resetAfterConfirmation() {
            this.currentStep = 'cart';
            this.close();
            this.renderDrawer();
        }

        // WhatsApp Checkout for Order
        sendOrderWhatsApp(orderId = null) {
            const o = this.lastOrder;
            if (!o) return;
            const isAr = this.lang === 'ar';
            const total = o.totalPrice.toLocaleString();

            let msg = isAr
                ? `*طلب معتمد جديد من كتالوج عالم الإكسسوارات* 🌟\n`
                : `*New Confirmed Order from World of Accessories* 🌟\n`;
            
            msg += `🔖 *رقم الطلب:* #${o.id}\n`;
            msg += `👤 *اسم العميل:* ${o.customer.name}\n`;
            msg += `📞 *رقم الهاتف:* ${o.customer.phone}\n`;
            if (o.customer.phoneAlt) msg += `📱 *هاتف بديل:* ${o.customer.phoneAlt}\n`;
            msg += `📍 *المحافظة:* ${o.customer.governorate}\n`;
            msg += `🏠 *العنوان:* ${o.customer.address}\n`;
            if (o.customer.notes) msg += `📝 *ملاحظات:* ${o.customer.notes}\n`;
            msg += `💵 *طريقة الدفع:* الدفع عند الاستلام والمعاينة\n`;
            msg += `------------------------------------\n`;
            msg += `*قائمة الأصناف المطلوبة:*\n`;

            o.items.forEach((item, index) => {
                const name = isAr ? item.ar : (item.en || item.ar);
                const itemTotal = (item.price * item.qty).toLocaleString();
                const color = isAr ? item.color_ar : (item.color_en || item.color_ar);
                const specs = isAr ? item.specs_ar : (item.specs_en || item.specs_ar);
                msg += `${index + 1}. *${name}* (${item.code})\n`;
                if (color) msg += `   🎨 اللون: ${color}\n`;
                if (specs) msg += `   ⚙️ المواصفات: ${specs}\n`;
                msg += `   📦 الكمية: ${item.qty} | السعر: ${item.price} ج.م | الإجمالي: ${itemTotal} ج.م\n`;
            });

            msg += `------------------------------------\n`;
            msg += `💰 *إجمالي قيمة الطلب:* ${total} ج.م\n`;
            msg += `📦 *إجمالي عدد القطع:* ${o.totalCount}\n`;
            msg += `يرجى تأكيد استلام الطلب وتحديد موعد التوصيل والمعاينة. شكراً لكم!`;

            const waUrl = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(msg)}`;
            window.open(waUrl, '_blank', 'noopener,noreferrer');
        }

        // Direct Quick WhatsApp for current cart items
        checkoutWhatsApp() {
            if (this.items.length === 0) return;
            const isAr = this.lang === 'ar';
            const count = this.getTotalCount();
            const total = this.getTotalPrice().toLocaleString();

            let msg = isAr
                ? `*طلب مباشر من سلة عالم الإكسسوارات* 🛒\n`
                : `*Direct Order from World of Accessories Cart* 🛒\n`;

            msg += `------------------------------------\n`;
            this.items.forEach((item, index) => {
                const name = isAr ? item.ar : (item.en || item.ar);
                const itemTotal = (item.price * item.qty).toLocaleString();
                const color = isAr ? item.color_ar : (item.color_en || item.color_ar);
                const specs = isAr ? item.specs_ar : (item.specs_en || item.specs_ar);
                msg += `${index + 1}. *${name}* (${item.code})\n`;
                if (color) msg += `   • اللون: ${color}\n`;
                if (specs) msg += `   • المواصفات: ${specs}\n`;
                msg += `   • الكمية: ${item.qty} | الإجمالي: ${itemTotal} ج.م\n`;
            });

            msg += `------------------------------------\n`;
            msg += `💰 *إجمالي القيمة:* ${total} ج.م\n`;
            msg += `📦 *إجمالي عدد القطع:* ${count}\n`;
            msg += `يرجى تأكيد التوافر وإجراءات الاستلام أو التوصيل. شكراً لكم!`;

            const waUrl = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(msg)}`;
            window.open(waUrl, '_blank', 'noopener,noreferrer');
        }

        // Print Order Invoice
        printOrderInvoice(orderId = null) {
            const o = this.lastOrder;
            if (!o) return;
            const isAr = this.lang === 'ar';
            const dateStr = new Date(o.date).toLocaleDateString(isAr ? 'ar-EG' : 'en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            let rows = '';
            o.items.forEach((item, i) => {
                const name = isAr ? item.ar : (item.en || item.ar);
                const itemTotal = (item.price * item.qty).toLocaleString();
                rows += `
                    <tr>
                        <td style="padding:10px; border-bottom:1px solid #E2E8F0; text-align:center;">${i + 1}</td>
                        <td style="padding:10px; border-bottom:1px solid #E2E8F0; font-weight:700;">${escapeHTML(item.code)}</td>
                        <td style="padding:10px; border-bottom:1px solid #E2E8F0;">
                            ${escapeHTML(name)}
                            ${item.color_ar ? `<br><small style="color:#64748B;">اللون: ${escapeHTML(item.color_ar)}</small>` : ''}
                        </td>
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
                    <title>فاتورة طلب رسمي - عالم الإكسسوارات #${o.id}</title>
                    <style>
                        body { font-family: 'Tajawal', sans-serif, Arial; margin: 40px; color: #0F172A; }
                        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #1A3F7F; padding-bottom: 20px; margin-bottom: 24px; }
                        .brand h1 { margin: 0 0 4px; font-size: 22px; color: #1A3F7F; }
                        .brand p { margin: 0; color: #64748B; font-size: 13px; }
                        .meta { text-align: ${isAr ? 'left' : 'right'}; font-size: 13px; }
                        .cust-box { background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 14px 18px; margin-bottom: 20px; font-size: 13px; line-height: 1.8; }
                        table { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 13px; }
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
                            <strong style="font-size:16px; color:#1A3F7F;">إيصال وفاتورة طلب معتمد</strong><br>
                            رقم الطلب: #${o.id}<br>
                            التاريخ: ${dateStr}
                        </div>
                    </div>

                    <div class="cust-box">
                        <strong>بيانات العميل والتوصيل:</strong><br>
                        الاسم: ${escapeHTML(o.customer.name)} | رقم الهاتف: ${escapeHTML(o.customer.phone)}<br>
                        المحافظة والعنوان: ${escapeHTML(o.customer.governorate)} – ${escapeHTML(o.customer.address)}<br>
                        طريقة السداد: الدفع عند الاستلام والمعاينة
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
                            <strong>${o.totalCount} قطعة</strong>
                        </div>
                        <div style="display:flex; justify-content:space-between; font-size:16px; font-weight:800; color:#1A3F7F; border-top:1px dashed #CBD5E1; padding-top:8px;">
                            <span>المجموع الكلي:</span>
                            <span>${o.totalPrice.toLocaleString()} ج.م</span>
                        </div>
                    </div>

                    <div class="footer-note">
                        <p>عالم الإكسسوارات &bull; الرائدون في إكسسوارات الأثاث والمطابخ الفاخرة &bull; Created by yasserious.com</p>
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

        // Print Quotation
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

                    <div id="woaCartStepsNav" class="woa-checkout-steps"></div>

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
                            <button type="button" class="woa-btn-proceed-checkout" onclick="WOACart.setStep('checkout')">
                                <span>🛍️</span>
                                <span>${escapeHTML(t.proceedCheckout)}</span>
                            </button>
                            <button type="button" class="woa-btn-whatsapp-order" onclick="WOACart.checkoutWhatsApp()">
                                <span>💬</span>
                                <span>${escapeHTML(t.quickWhatsapp)}</span>
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
            const overlay = document.getElementById('woaCartOverlay');
            if (overlay) {
                overlay.addEventListener('click', (e) => {
                    if (e.target === overlay) {
                        this.close();
                    }
                });
            }

            window.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isOpen) {
                    this.close();
                }
            });

            window.addEventListener('popstate', () => {
                if (this.isOpen) {
                    this.close();
                }
            });
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        window.WOACart = new CartService();
    });

    if (document.readyState === 'interactive' || document.readyState === 'complete') {
        if (!window.WOACart) {
            window.WOACart = new CartService();
        }
    }

})();
