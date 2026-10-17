const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();
  await page.goto('https://woa-market.vercel.app/en/catalog', { waitUntil: 'networkidle' });

  const overflowElements = await page.evaluate(() => {
    const docWidth = document.documentElement.clientWidth;
    const elements = document.querySelectorAll('*');
    const culprits = [];

    for (const el of elements) {
      const rect = el.getBoundingClientRect();
      if (rect.right > docWidth + 1 || rect.left < -1) {
        culprits.push({
          tagName: el.tagName,
          id: el.id,
          className: el.className,
          left: rect.left,
          right: rect.right,
          width: rect.width,
          docWidth: docWidth,
          outerHTML: el.outerHTML.slice(0, 150)
        });
      }
    }
    return culprits;
  });

  console.log('Culprit elements in /en/catalog:', JSON.stringify(overflowElements, null, 2));
  await browser.close();
})();
