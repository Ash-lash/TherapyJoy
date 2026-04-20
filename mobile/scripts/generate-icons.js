// Rasterizes SVG logos to PNG sizes required by Expo.
// Run: npm run icons   (after npm i -D sharp)
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SVG_MAIN = path.join(__dirname, 'logo.svg');
const SVG_FG = path.join(__dirname, 'logoForeground.svg');
const ASSETS = path.join(ROOT, 'assets');

async function png(svgPath, out, size, bg = null) {
  const svg = fs.readFileSync(svgPath);
  const img = sharp(svg, { density: 600 }).resize(size, size);
  if (bg) img.flatten({ background: bg });
  await img.png().toFile(out);
  console.log('✓', path.relative(ROOT, out));
}

(async () => {
  if (!fs.existsSync(ASSETS)) fs.mkdirSync(ASSETS, { recursive: true });
  await png(SVG_MAIN, path.join(ASSETS, 'icon.png'), 1024);
  await png(SVG_FG, path.join(ASSETS, 'adaptive-icon.png'), 1024);
  await png(SVG_MAIN, path.join(ASSETS, 'splash-icon.png'), 1024);
  await png(SVG_MAIN, path.join(ASSETS, 'favicon.png'), 128);
  await png(SVG_MAIN, path.join(ASSETS, 'logo-512.png'), 512);
  console.log('\nAll icons written to assets/.');
})();
