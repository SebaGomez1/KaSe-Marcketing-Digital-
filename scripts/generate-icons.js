import fs from 'fs';
import path from 'path';
import { PNG } from 'pngjs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.resolve(__dirname, '../public');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Brand colors: Deep dark #0B0B0B, emerald #10B981, cyber blue #38BDF8
function createIcon(size, isMaskable = false) {
  const png = new PNG({ width: size, height: size });
  const center = size / 2;
  const radius = isMaskable ? size * 0.38 : size * 0.44;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (size * y + x) << 2;
      const dx = x - center;
      const dy = y - center;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Background
      if (isMaskable) {
        png.data[idx] = 11;     // #0B
        png.data[idx + 1] = 11; // #0B
        png.data[idx + 2] = 11; // #0B
        png.data[idx + 3] = 255;
      } else {
        png.data[idx] = 11;
        png.data[idx + 1] = 11;
        png.data[idx + 2] = 11;
        png.data[idx + 3] = 255;
      }

      // Rounded emblem circle
      if (dist < radius) {
        // Inner gradient
        const t = (y / size);
        png.data[idx] = Math.round(16 + t * 5);
        png.data[idx + 1] = Math.round(24 + t * 5);
        png.data[idx + 2] = Math.round(24 + t * 5);
        png.data[idx + 3] = 255;

        // Border ring
        if (dist > radius - (size * 0.02)) {
          png.data[idx] = 16;
          png.data[idx + 1] = 185;
          png.data[idx + 2] = 129; // Emerald #10B981
          png.data[idx + 3] = 255;
        }

        // Central stylized bolt / "K" shape
        const normX = (x - center) / radius;
        const normY = (y - center) / radius;

        // Draw lightning bolt
        if (
          (normX > -0.25 && normX < 0.25 && normY > -0.55 && normY < 0.55) &&
          ((normX * 1.5 - normY * 0.8) > -0.3 && (normX * 1.5 - normY * 0.8) < 0.35)
        ) {
          png.data[idx] = 16;
          png.data[idx + 1] = 185;
          png.data[idx + 2] = 129;
          png.data[idx + 3] = 255;
        }
      }
    }
  }

  return png;
}

const icons = [
  { name: 'pwa-192x192.png', size: 192, maskable: false },
  { name: 'pwa-512x512.png', size: 512, maskable: false },
  { name: 'pwa-maskable-512x512.png', size: 512, maskable: true },
  { name: 'apple-touch-icon.png', size: 180, maskable: false },
];

for (const icon of icons) {
  const filePath = path.join(publicDir, icon.name);
  const png = createIcon(icon.size, icon.maskable);
  const buffer = PNG.sync.write(png);
  fs.writeFileSync(filePath, buffer);
  console.log(`Generated ${icon.name} (${icon.size}x${icon.size})`);
}

// Generate SVG icon
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <rect width="512" height="512" fill="#0B0B0B" rx="100"/>
  <circle cx="256" cy="256" r="210" fill="#141414" stroke="#10B981" stroke-width="12"/>
  <path d="M280 80 L180 270 L260 270 L230 430 L340 230 L260 230 Z" fill="#10B981"/>
</svg>`;

fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgContent);
console.log('Generated icon.svg');
