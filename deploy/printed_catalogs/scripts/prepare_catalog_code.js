const fs = require("fs");
const path = require("path");

const products = JSON.parse(fs.readFileSync(path.join(__dirname, "parsed_products.json"), "utf8"));
if (products.length !== 591) {
  throw new Error(`Expected 591 products, got ${products.length}`);
}

console.log(`Loaded ${products.length} products successfully.`);

// Helper to escape strings for JS code
function jsStr(str) {
  return JSON.stringify(str);
}

// 1. Generate payload loader code
const payloadLoaderJs = `
storage.products = ${JSON.stringify(products)};
return {
  loaded: storage.products.length,
  first: storage.products[0],
  last: storage.products[storage.products.length - 1]
};
`;
fs.writeFileSync(path.join(__dirname, "step1_load_payload.js"), payloadLoaderJs);

// 2. Generate assets and English page builder
const buildEnglishJs = `
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

// 1. Color assets
const lib = penpot.library.local;
for (const [name, color] of [['color_dark', black], ['color_light', white], ['color_accent', accent]]) {
  let c = lib.colors.find(x => x.name === name);
  if (!c) {
    c = lib.createColor();
    c.name = name;
  }
  c.color = color;
}

// 2. Typography assets
const typoDefs = [
  ['en_heading', 'Comfortaa', '36', '700', '1.2'],
  ['en_vertical', 'Comfortaa', '48', '400', '1.2'],
  ['en_body', 'Comfortaa', '10', '400', '1.5'],
  ['en_product_title', 'Comfortaa', '12', '700', '1.2'],
  ['en_price', 'Comfortaa', '12', '500', '1.2'],
  ['ar_heading', 'Tajawal', '36', '700', '1.2'],
  ['ar_vertical', 'Tajawal', '48', '400', '1.2'],
  ['ar_body', 'Tajawal', '10', '400', '1.5'],
  ['ar_product_title', 'Tajawal', '12', '700', '1.2'],
  ['ar_price', 'Tajawal', '12', '500', '1.2']
];

for (const [name, family, size, weight, lh] of typoDefs) {
  let t = lib.typographies.find(x => x.name === name);
  if (!t) {
    t = lib.createTypography();
    t.name = name;
  }
  t.fontFamily = family;
  t.fontSize = size;
  t.fontWeight = weight;
  t.lineHeight = lh;
}

// 3. Upload placeholder image for avatars
const base64Png = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==";
const binaryStr = atob(base64Png);
const bytes = new Uint8Array(binaryStr.length);
for (let i = 0; i < binaryStr.length; i++) bytes[i] = binaryStr.charCodeAt(i);
const placeholderImg = await penpot.uploadMediaData("product_avatar_placeholder.png", bytes, "image/png");

// 4. Create English Page
let pageEn = penpotUtils.getPageByName("Catalog · English LTR");
if (!pageEn) {
  pageEn = penpot.createPage();
  pageEn.name = "Catalog · English LTR";
}
await penpot.openPage(pageEn);

// Text creation helper
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

// Board creation helper (A4 595 x 842)
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

// 5. English Cover Board
const coverEn = createA4Board("Catalog · English LTR · 00 · COVER", 0, 0);

// Top accent header bar
const accentBarEn = penpot.createRectangle();
accentBarEn.name = "Accent Header Bar";
accentBarEn.resize(595, 12);
accentBarEn.x = 0;
accentBarEn.y = 0;
fill(accentBarEn, black);
coverEn.appendChild(accentBarEn);

// Cover badge
const badgeEn = penpot.createRectangle();
badgeEn.name = "Category Badge";
badgeEn.resize(180, 32);
badgeEn.x = 52;
badgeEn.y = 60;
badgeEn.borderRadius = 16;
fill(badgeEn, accent);
coverEn.appendChild(badgeEn);

const badgeTextEn = createTextEl("CATALOGUE 2026", "Comfortaa", 11, 700, "left", 160, 20);
badgeTextEn.x = 68;
badgeTextEn.y = 68;
coverEn.appendChild(badgeTextEn);

// Cover Main Title
const hEn = createTextEl("PRODUCT CATALOG", "Comfortaa", 36, 700, "left", 490, 50);
hEn.x = 52;
hEn.y = 110;
coverEn.appendChild(hEn);

// Cover Subtitle
const subEn = createTextEl("Complete Architectural Hardware & Fittings Collection", "Comfortaa", 14, 400, "left", 490, 28);
subEn.x = 52;
subEn.y = 165;
coverEn.appendChild(subEn);

// Decorative frame
const frameEn = penpot.createRectangle();
frameEn.name = "Decorative Hero Frame";
frameEn.resize(491, 380);
frameEn.x = 52;
frameEn.y = 220;
frameEn.borderRadius = 8;
fill(frameEn, accent);
coverEn.appendChild(frameEn);

// Key Stats Lockup inside Cover
const statsBoardEn = penpot.createBoard();
statsBoardEn.name = "Catalog Specifications";
statsBoardEn.resize(440, 160);
statsBoardEn.x = 77;
statsBoardEn.y = 250;
fill(statsBoardEn, white);
statsBoardEn.borderRadius = 6;
statsBoardEn.addFlexLayout();
statsBoardEn.flex.dir = 'column';
statsBoardEn.flex.rowGap = 12;
statsBoardEn.flex.verticalPadding = 18;
statsBoardEn.flex.horizontalPadding = 20;

const stat1En = createTextEl("• 591 Verified Product References", "Comfortaa", 13, 700, "left");
const stat2En = createTextEl("• 74 Dense List Plates (8 Items / Page Grid)", "Comfortaa", 13, 500, "left");
const stat3En = createTextEl("• Standard A4 Portrait Architecture (595 × 842)", "Comfortaa", 13, 500, "left");
const stat4En = createTextEl("• All Quotations in Egyptian Pounds (EGP)", "Comfortaa", 13, 500, "left");
statsBoardEn.appendChild(stat1En);
statsBoardEn.appendChild(stat2En);
statsBoardEn.appendChild(stat3En);
statsBoardEn.appendChild(stat4En);
coverEn.appendChild(statsBoardEn);

// Cover Footer
const footerEn = createTextEl("Catalog · English LTR · Page 00 · Official Catalogue", "Comfortaa", 10, 400, "left", 490, 20);
footerEn.x = 52;
footerEn.y = 780;
coverEn.appendChild(footerEn);

// 6. English Table of Contents Board
const tocEn = createA4Board("Catalog · English LTR · 01 · TABLE OF CONTENTS", 650, 0);

const tocBarEn = penpot.createRectangle();
tocBarEn.name = "Accent Header Bar";
tocBarEn.resize(595, 12);
tocBarEn.x = 0;
tocBarEn.y = 0;
fill(tocBarEn, black);
tocEn.appendChild(tocBarEn);

const tocTitleEn = createTextEl("TABLE OF CONTENTS", "Comfortaa", 36, 700, "left", 490, 50);
tocTitleEn.x = 52;
tocTitleEn.y = 60;
tocEn.appendChild(tocTitleEn);

const tocSubEn = createTextEl("Catalogue Structure & Overview (74 Dense Product Plates)", "Comfortaa", 13, 400, "left", 490, 24);
tocSubEn.x = 52;
tocSubEn.y = 115;
tocEn.appendChild(tocSubEn);

// TOC Sections container
const tocContainerEn = penpot.createBoard();
tocContainerEn.name = "TOC Sections Container";
tocContainerEn.resize(491, 560);
tocContainerEn.x = 52;
tocContainerEn.y = 160;
fill(tocContainerEn, accent);
tocContainerEn.borderRadius = 8;
tocContainerEn.addFlexLayout();
tocContainerEn.flex.dir = 'column';
tocContainerEn.flex.rowGap = 16;
tocContainerEn.flex.verticalPadding = 24;
tocContainerEn.flex.horizontalPadding = 24;

const sectionsEn = [
  ["Plate 01 – 15", "Hinges, Hydraulic Arms & Dampers", "Items 1 – 120"],
  ["Plate 16 – 30", "Drawer Slides, Runners & Mechanisms", "Items 121 – 240"],
  ["Plate 31 – 45", "Handles, Built-In Hooks & Profiles", "Items 241 – 360"],
  ["Plate 46 – 60", "Kitchen Baskets, Wastebins & Organizers", "Items 361 – 480"],
  ["Plate 61 – 74", "Dressing Accessories, Safes & Miscellaneous", "Items 481 – 591"]
];

for (const [plate, desc, range] of sectionsEn) {
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

  const tPlate = createTextEl(plate + "  |  " + desc, "Comfortaa", 12, 700, "left");
  const tRange = createTextEl(range + " · Currency: EGP", "Comfortaa", 11, 500, "left");
  row.appendChild(tPlate);
  row.appendChild(tRange);
  tocContainerEn.appendChild(row);
}
tocEn.appendChild(tocContainerEn);

const tocFooterEn = createTextEl("Catalog · English LTR · Page 01 · Table of Contents", "Comfortaa", 10, 400, "left", 490, 20);
tocFooterEn.x = 52;
tocFooterEn.y = 780;
tocEn.appendChild(tocFooterEn);

// 7. Master Templates for Components
const masterItemEn = penpot.createBoard();
masterItemEn.name = "List Item Lockup EN LTR";
masterItemEn.resize(250, 128);
fill(masterItemEn, white);
masterItemEn.addFlexLayout();
masterItemEn.flex.dir = 'row';
masterItemEn.flex.columnGap = 16;
masterItemEn.flex.alignItems = 'center';

const masterAvEn = penpot.createEllipse();
masterAvEn.name = "Circular Product Avatar";
masterAvEn.resize(90, 90);
masterAvEn.fills = [{ fillImage: placeholderImg, fillOpacity: 1 }];
masterItemEn.appendChild(masterAvEn);

const masterLockupEn = penpot.createBoard();
masterLockupEn.name = "Product Text Lockup EN LTR";
masterLockupEn.resize(135, 90);
fill(masterLockupEn, white);
masterLockupEn.addFlexLayout();
masterLockupEn.flex.dir = 'column';
masterLockupEn.flex.rowGap = 4;
masterLockupEn.flex.alignItems = 'start';

const masterTitleEn = createTextEl("Product Title Placeholder", "Comfortaa", 12, 700, "left", 135, 55);
const masterPriceEn = createTextEl("0.00 EGP", "Comfortaa", 12, 500, "left", 135, 20);
masterLockupEn.appendChild(masterTitleEn);
masterLockupEn.appendChild(masterPriceEn);
masterItemEn.appendChild(masterLockupEn);

// Master Product Board template (2 cols x 4 rows grid)
const masterBoardEn = penpot.createBoard();
masterBoardEn.name = "Master Product Board EN";
masterBoardEn.resize(595, 842);
fill(masterBoardEn, white);
masterBoardEn.clipContent = true;
masterBoardEn.addGridLayout();
masterBoardEn.grid.addColumn('flex', 1);
masterBoardEn.grid.addColumn('flex', 1);
masterBoardEn.grid.addRow('flex', 1);
masterBoardEn.grid.addRow('flex', 1);
masterBoardEn.grid.addRow('flex', 1);
masterBoardEn.grid.addRow('flex', 1);
masterBoardEn.grid.columnGap = 20;
masterBoardEn.grid.rowGap = 18;
masterBoardEn.grid.horizontalPadding = 32;
masterBoardEn.grid.verticalPadding = 48;

for (let i = 0; i < 8; i++) {
  const item = masterItemEn.clone();
  masterBoardEn.grid.appendChild(item, Math.floor(i / 2) + 1, (i % 2) + 1);
}

// 8. Build 74 Dense Product List Boards
let enProductCount = 0;
for (let pg = 0; pg < 74; pg++) {
  const pageNum = String(pg + 1).padStart(2, '0');
  const boardName = "Catalog · English LTR · " + pageNum + " · DENSE PRODUCT LIST";
  const bX = (pg % 3) * 650;
  const bY = 950 + Math.floor(pg / 3) * 900;

  const b = masterBoardEn.clone();
  b.name = boardName;
  b.x = bX;
  b.y = bY;

  const chunk = products.slice(pg * 8, pg * 8 + 8);
  const items = b.children;

  // For the last page if fewer than 8 products, remove excess items
  for (let i = 7; i >= chunk.length; i--) {
    items[i].remove();
  }

  for (let i = 0; i < chunk.length; i++) {
    const p = chunk[i];
    const item = items[i];
    item.setPluginData("catalog", JSON.stringify({ id: p.n, language: "EN" }));
    
    const lockup = item.children[1];
    const ch = lockup.children;
    ch[0].characters = p.en;
    ch[1].characters = p.price + " EGP";
    enProductCount++;
  }
}

// Register Master Components in library using the templates
const compAv = lib.createComponent([masterAvEn]);
compAv.name = "Circular Product Avatar";

const compLockupEn = lib.createComponent([masterLockupEn]);
compLockupEn.name = "Product Text Lockup EN LTR";

const compItemEn = lib.createComponent([masterItemEn]);
compItemEn.name = "List Item Lockup EN LTR";

// Clean up helper board
masterBoardEn.remove();

// Position master templates neatly off-grid
masterItemEn.x = 1350;
masterItemEn.y = 0;

return {
  englishPage: pageEn.name,
  boardsCreated: pageEn.root.children.filter(s => s.type === 'board').length,
  enProductCount
};
`;
fs.writeFileSync(path.join(__dirname, "step2_build_english.js"), buildEnglishJs);

// 3. Generate Arabic page builder
const buildArabicJs = `
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
`;
fs.writeFileSync(path.join(__dirname, "step3_build_arabic.js"), buildArabicJs);

// 4. Verification script
const verifyJs = `
const pages = penpotUtils.getPages();
const pageNames = pages.map(p => p.name);

let totalA4Boards = 0;
let enProducts = 0;
let arProducts = 0;

const pageDetails = [];

for (const pInfo of pages) {
  const p = penpotUtils.getPageById(pInfo.id);
  if (!p) continue;
  
  const topBoards = p.root.children.filter(s => s.type === 'board' && s.width === 595 && s.height === 842);
  totalA4Boards += topBoards.length;
  
  const allShapes = penpotUtils.findShapes(s => true, p.root);
  const catalogItems = allShapes.filter(s => {
    try {
      const data = s.getPluginData('catalog');
      return !!data;
    } catch (e) {
      return false;
    }
  });

  const enItemsOnPage = catalogItems.filter(s => {
    try {
      const d = JSON.parse(s.getPluginData('catalog'));
      return d.language === 'EN';
    } catch(e) { return false; }
  }).length;

  const arItemsOnPage = catalogItems.filter(s => {
    try {
      const d = JSON.parse(s.getPluginData('catalog'));
      return d.language === 'AR';
    } catch(e) { return false; }
  }).length;

  enProducts += enItemsOnPage;
  arProducts += arItemsOnPage;

  pageDetails.push({
    name: p.name,
    a4Boards: topBoards.length,
    enItems: enItemsOnPage,
    arItems: arItemsOnPage
  });
}

const lib = penpot.library.local;
const colors = lib.colors.map(c => ({ name: c.name, color: c.color }));
const typographies = lib.typographies.map(t => ({ name: t.name, family: t.fontFamily }));
const components = lib.components.map(c => c.name);

return {
  pagesCount: pages.length,
  pageNames,
  pageDetails,
  totalA4Boards,
  enProducts,
  arProducts,
  totalProductEntries: enProducts + arProducts,
  colors,
  typographies,
  components
};
`;
fs.writeFileSync(path.join(__dirname, "step4_verify.js"), verifyJs);

console.log("All generation step files written successfully.");
