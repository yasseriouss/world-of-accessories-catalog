
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
