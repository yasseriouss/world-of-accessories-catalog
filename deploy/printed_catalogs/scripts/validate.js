const fs = require("fs");
const path = require("path");

const text = fs.readFileSync(path.join(__dirname, "all_products_payload.txt"), "utf8");
const lines = text.split(/\r?\n/);
const items = [];

for (let i = 0; i < lines.length; i++) {
  const m = lines[i].match(/^\s*(\d+)\.\s*$/);
  if (m) {
    const num = parseInt(m[1], 10);
    const arLine = (lines[i + 1] || "").trim();
    const enLine = (lines[i + 2] || "").trim();
    const am = arLine.match(/AR Title:\s*\"(.*)\"\s*\|\s*Price:\s*([0-9.]+)\s*EGP/);
    const em = enLine.match(/EN Title:\s*\"(.*)\"\s*\|\s*Price:\s*([0-9.]+)\s*EGP/);
    if (!am || !em) {
      console.error("Mismatch at #", num, ":\n  AR:", arLine, "\n  EN:", enLine);
    } else {
      items.push({
        n: num,
        ar: am[1],
        en: em[1],
        price: am[2]
      });
    }
  }
}

console.log("Total items parsed:", items.length);
fs.writeFileSync(path.join(__dirname, "parsed_products.json"), JSON.stringify(items));
console.log("Wrote parsed_products.json successfully.");
