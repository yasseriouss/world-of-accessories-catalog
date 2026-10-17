# API Spec (Route Handlers — shared shape)

Base: `/api/v1` — كل الردود: `{ ok, data, error }`

## Public (المتجر + اللاندنج)
| Method | Endpoint | الوصف |
|---|---|---|
| GET  | `/products?category=&q=&sort=&min=&max=&page=` | كتالوج مع فلاتر (ISR 60s) |
| GET  | `/products/[slug]` | تفاصيل منتج + related + schema جاهز |
| GET  | `/products/featured` | للبنرات/الهيرو في اللاندنج |
| GET  | `/categories` | شجرة الأقسام |
| GET  | `/shipping-zones` | محافظات مصر + الرسوم |
| GET  | `/banners?placement=` | بنرات مفعّلة ضمن الفترة |
| GET  | `/posts?category=&page=` | مقالات منشورة |
| GET  | `/posts/[slug]` | مقال + FAQ sections + related posts |

## Orders
| Method | Endpoint | الوصف |
|---|---|---|
| POST | `/orders` | إنشاء طلب (تحقق مخزون + كوبون) → إشعار واتساب للإدارة |
| GET  | `/orders/track?phone=&order_no=` | تتبع بدون حساب |
| POST | `/orders/[id]/confirm-transfer` | إرفاق إيصال تحويل (Vodafone Cash/InstaPay) |

## B2B
| POST | `/b2b-quotes` | نموذج اللاندنج → يظهر فوراً في الداشبورد |

## Admin (مصادقة Supabase)
| Method | Endpoint | الوصف |
|---|---|---|
| CRUD | `/admin/products` | + رفع صور متعددة لـ Storage |
| CRUD | `/admin/posts` | محرر MDX |
| PATCH | `/admin/orders/[id]/status` | تغيير حالة → خصم مخزون تلقائي (Trigger) |
| CRUD | `/admin/banners` | جدولة + تفعيل |
| GET  | `/admin/analytics/summary` | مبيعات/زيارات/أفضل منتجات |
