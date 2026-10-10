
const products = storage.products;
if (!products || products.length !== 591) {
  throw new Error("storage.products not found or length !== 591");
}

const black = '#000000';
const white = '#FFFFFF';
const accent = '#F5F5F5';

function fill(shape, color) {
  shape.fills = [{ fillColor: color, fillOpacity: 1 }];
}

const lib = penpot.library.local;

// Get or create placeholder image
const base64Png = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==";
const binaryStr = atob(base64Png);
const bytes = new Uint8Array(binaryStr.length);
for (let i = 0; i < binaryStr.length; i++) bytes[i] = binaryStr.charCodeAt(i);
const placeholderImg = await penpot.uploadMediaData("product_avatar_placeholder.png", bytes, "image/png");

// Create Arabic Page
let pageAr = penpotUtils.getPageByName("Catalog · Arabic RTL");
if (!pageAr) {
  pageAr = penpot.createPage();
  pageAr.name = "Catalog · Arabic RTL";
}
await penpot.openPage(pageAr);

function createTextEl(characters, fontFamily, fontSize, fontWeight, align, width, height) {
  const t = penpot.createText(characters);
  t.characters = characters;
  t.fontFamily = fontFamily;
  t.fontSize = String(fontSize);
  t.fontWeight = String(fontWeight);
  t.align = align;
  t.fills = [{ fillColor: black, fillOpacity: 1 }];
  if (width && height) {
    t.resize(width, height);
  }
  return t;
}

function createA4Board(name, x, y) {
  const b = penpot.createBoard();
  b.name = name;
  b.x = x;
  b.y = y;
  b.resize(595, 842);
  fill(b, white);
  b.clipContent = true;
  return b;
}

// 1. Arabic Cover Board
const coverAr = createA4Board("Catalog · Arabic RTL · 00 · COVER", 0, 0);

const accentBarAr = penpot.createRectangle();
accentBarAr.name = "Accent Header Bar";
accentBarAr.resize(595, 12);
accentBarAr.x = 0;
accentBarAr.y = 0;
fill(accentBarAr, black);
coverAr.appendChild(accentBarAr);

const badgeAr = penpot.createRectangle();
badgeAr.name = "Category Badge";
badgeAr.resize(180, 32);
badgeAr.x = 363;
badgeAr.y = 60;
badgeAr.borderRadius = 16;
fill(badgeAr, accent);
coverAr.appendChild(badgeAr);

const badgeTextAr = createTextEl("كتالوج ٢٠٢٦", "Tajawal", 12, 700, "right", 160, 20);
badgeTextAr.x = 373;
badgeTextAr.y = 66;
coverAr.appendChild(badgeTextAr);

const hAr = createTextEl("كتالوج المنتجات", "Tajawal", 36, 700, "right", 490, 50);
hAr.x = 52;
hAr.y = 110;
coverAr.appendChild(hAr);

const subAr = createTextEl("الدليل الشامل للإكسسوارات والمفصلات ومستلزمات المطابخ والدريسنج", "Tajawal", 14, 400, "right", 490, 28);
subAr.x = 52;
subAr.y = 165;
coverAr.appendChild(subAr);

const frameAr = penpot.createRectangle();
frameAr.name = "Decorative Hero Frame";
frameAr.resize(491, 380);
frameAr.x = 52;
frameAr.y = 220;
frameAr.borderRadius = 8;
fill(frameAr, accent);
coverAr.appendChild(frameAr);

const statsBoardAr = penpot.createBoard();
statsBoardAr.name = "Catalog Specifications";
statsBoardAr.resize(440, 160);
statsBoardAr.x = 77;
statsBoardAr.y = 250;
fill(statsBoardAr, white);
statsBoardAr.borderRadius = 6;
statsBoardAr.addFlexLayout();
statsBoardAr.flex.dir = 'column';
statsBoardAr.flex.rowGap = 12;
statsBoardAr.flex.verticalPadding = 18;
statsBoardAr.flex.horizontalPadding = 20;

const stat1Ar = createTextEl("• ٥٩١ منتج معتمد ومسجل بالكامل", "Tajawal", 13, 700, "right");
const stat2Ar = createTextEl("• ٧٤ لوحة عرض مكثفة (شبكة ٨ منتجات لكل صفحة)", "Tajawal", 13, 500, "right");
const stat3Ar = createTextEl("• تنسيق قياسي A4 رأسي (٥٩٥ × ٨٤٢)", "Tajawal", 13, 500, "right");
const stat4Ar = createTextEl("• جميع الأسعار بالجنيه المصري (EGP)", "Tajawal", 13, 500, "right");
statsBoardAr.appendChild(stat1Ar);
statsBoardAr.appendChild(stat2Ar);
statsBoardAr.appendChild(stat3Ar);
statsBoardAr.appendChild(stat4Ar);
coverAr.appendChild(statsBoardAr);

const footerAr = createTextEl("كتالوج · النسخة العربية RTL · صفحة ٠٠ · الغلاف الرسمي", "Tajawal", 10, 400, "right", 490, 20);
footerAr.x = 52;
footerAr.y = 780;
coverAr.appendChild(footerAr);

// 2. Arabic Table of Contents Board
const tocAr = createA4Board("Catalog · Arabic RTL · 01 · TABLE OF CONTENTS", 650, 0);

const tocBarAr = penpot.createRectangle();
tocBarAr.name = "Accent Header Bar";
tocBarAr.resize(595, 12);
tocBarAr.x = 0;
tocBarAr.y = 0;
fill(tocBarAr, black);
tocAr.appendChild(tocBarAr);

const tocTitleAr = createTextEl("فهرس المحتويات", "Tajawal", 36, 700, "right", 490, 50);
tocTitleAr.x = 52;
tocTitleAr.y = 60;
tocAr.appendChild(tocTitleAr);

const tocSubAr = createTextEl("هيكل دليل المنتجات (٧٤ لوحة عرض مكثفة)", "Tajawal", 13, 400, "right", 490, 24);
tocSubAr.x = 52;
tocSubAr.y = 115;
tocAr.appendChild(tocSubAr);

const tocContainerAr = penpot.createBoard();
tocContainerAr.name = "TOC Sections Container";
tocContainerAr.resize(491, 560);
tocContainerAr.x = 52;
tocContainerAr.y = 160;
fill(tocContainerAr, accent);
tocContainerAr.borderRadius = 8;
tocContainerAr.addFlexLayout();
tocContainerAr.flex.dir = 'column';
tocContainerAr.flex.rowGap = 16;
tocContainerAr.flex.verticalPadding = 24;
tocContainerAr.flex.horizontalPadding = 24;

const sectionsAr = [
  ["لوحات ٠١ – ١٥", "المفصلات، الأذرع الهيدروليكية والمساعدين", "المنتجات ١ – ١٢٠"],
  ["لوحات ١٦ – ٣٠", "مجاري الأدراج، السلايدات والأنظمة الحركية", "المنتجات ١٢١ – ٢٤٠"],
  ["لوحات ٣١ – ٤٥", "المقابض، قطاعات بلت إن والزوايا", "المنتجات ٢٤١ – ٣٦٠"],
  ["لوحات ٤٦ – ٦٠", "سلات المطابخ، التروليات والمنظمات", "المنتجات ٣٦١ – ٤٨٠"],
  ["لوحات ٦١ – ٧٤", "إكسسوارات الدريسنج، الخزن والتقسيمات", "المنتجات ٤٨١ – ٥٩١"]
];

for (const [plate, desc, range] of sectionsAr) {
  const row = penpot.createBoard();
  row.name = "TOC Row";
  row.resize(443, 80);
  fill(row, white);
  row.borderRadius = 6;
  row.addFlexLayout();
  row.flex.dir = 'column';
  row.flex.rowGap = 4;
  row.flex.verticalPadding = 12;
  row.flex.horizontalPadding = 16;

  const tPlate = createTextEl(plate + "  |  " + desc, "Tajawal", 12, 700, "right");
  const tRange = createTextEl(range + " · العملة: ج.م", "Tajawal", 11, 500, "right");
  row.appendChild(tPlate);
  row.appendChild(tRange);
  tocContainerAr.appendChild(row);
}
tocAr.appendChild(tocContainerAr);

const tocFooterAr = createTextEl("كتالوج · النسخة العربية RTL · صفحة ٠١ · فهرس المحتويات", "Tajawal", 10, 400, "right", 490, 20);
tocFooterAr.x = 52;
tocFooterAr.y = 780;
tocAr.appendChild(tocFooterAr);

// 3. Master Templates for Arabic Components
// Arabic Item: row-reverse flex, avatar on right, text lockup on left, right-aligned Tajawal
const masterItemAr = penpot.createBoard();
masterItemAr.name = "List Item Lockup AR RTL";
masterItemAr.resize(250, 128);
fill(masterItemAr, white);
masterItemAr.addFlexLayout();
masterItemAr.flex.dir = 'row-reverse';
masterItemAr.flex.columnGap = 16;
masterItemAr.flex.alignItems = 'center';

const masterAvAr = penpot.createEllipse();
masterAvAr.name = "Circular Product Avatar";
masterAvAr.resize(90, 90);
masterAvAr.fills = [{ fillImage: placeholderImg, fillOpacity: 1 }];
masterItemAr.appendChild(masterAvAr);

const masterLockupAr = penpot.createBoard();
masterLockupAr.name = "Product Text Lockup AR RTL";
masterLockupAr.resize(135, 90);
fill(masterLockupAr, white);
masterLockupAr.addFlexLayout();
masterLockupAr.flex.dir = 'column';
masterLockupAr.flex.rowGap = 4;
masterLockupAr.flex.alignItems = 'end';

const masterTitleAr = createTextEl("عنوان المنتج الافتراضي", "Tajawal", 12, 700, "right", 135, 55);
const masterPriceAr = createTextEl("0.00 EGP", "Tajawal", 12, 500, "right", 135, 20);
masterLockupAr.appendChild(masterTitleAr);
masterLockupAr.appendChild(masterPriceAr);
masterItemAr.appendChild(masterLockupAr);

// Master Product Board template (2 cols x 4 rows grid)
const masterBoardAr = penpot.createBoard();
masterBoardAr.name = "Master Product Board AR";
masterBoardAr.resize(595, 842);
fill(masterBoardAr, white);
masterBoardAr.clipContent = true;
masterBoardAr.addGridLayout();
masterBoardAr.grid.addColumn('flex', 1);
masterBoardAr.grid.addColumn('flex', 1);
masterBoardAr.grid.addRow('flex', 1);
masterBoardAr.grid.addRow('flex', 1);
masterBoardAr.grid.addRow('flex', 1);
masterBoardAr.grid.addRow('flex', 1);
masterBoardAr.grid.columnGap = 20;
masterBoardAr.grid.rowGap = 18;
masterBoardAr.grid.horizontalPadding = 32;
masterBoardAr.grid.verticalPadding = 48;

for (let i = 0; i < 8; i++) {
  const item = masterItemAr.clone();
  masterBoardAr.grid.appendChild(item, Math.floor(i / 2) + 1, (i % 2) + 1);
}

// 4. Build 74 Dense Product List Boards for Arabic
let arProductCount = 0;
for (let pg = 0; pg < 74; pg++) {
  const pageNum = String(pg + 1).padStart(2, '0');
  const boardName = "Catalog · Arabic RTL · " + pageNum + " · DENSE PRODUCT LIST";
  const bX = (pg % 3) * 650;
  const bY = 950 + Math.floor(pg / 3) * 900;

  const b = masterBoardAr.clone();
  b.name = boardName;
  b.x = bX;
  b.y = bY;

  const chunk = products.slice(pg * 8, pg * 8 + 8);
  const items = b.children;

  for (let i = 7; i >= chunk.length; i--) {
    items[i].remove();
  }

  for (let i = 0; i < chunk.length; i++) {
    const p = chunk[i];
    const item = items[i];
    item.setPluginData("catalog", JSON.stringify({ id: p.n, language: "AR" }));
    
    const lockup = item.children[1];
    const ch = lockup.children;
    ch[0].characters = p.ar;
    ch[1].characters = p.price + " EGP";
    arProductCount++;
  }
}

// Register Remaining Arabic Master Components in library
const compLockupAr = lib.createComponent([masterLockupAr]);
compLockupAr.name = "Product Text Lockup AR RTL";

const compItemAr = lib.createComponent([masterItemAr]);
compItemAr.name = "List Item Lockup AR RTL";

// Clean up helper board
masterBoardAr.remove();

masterItemAr.x = 1350;
masterItemAr.y = 0;

// Remove initial empty "Page 1" if it exists
const initialPage1 = penpotUtils.getPageByName("Page 1");
if (initialPage1 && penpotUtils.getPages().length > 2) {
  initialPage1.remove();
}

return {
  arabicPage: pageAr.name,
  boardsCreated: pageAr.root.children.filter(s => s.type === 'board').length,
  arProductCount
};
