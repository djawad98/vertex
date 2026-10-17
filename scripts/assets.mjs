// Turns raw files in _src/ into optimized site assets. Run: npm run assets
import sharp from 'sharp';
import { existsSync, mkdirSync } from 'node:fs';

const S = '_src', P = 'public', BG = [0x34, 0x3c, 0x49];
for (const d of [`${P}/work`, `${P}/team`, `${P}/brand`]) mkdirSync(d, { recursive: true });
const webp = (img, out, q = 78) => img.webp({ quality: q, effort: 6 }).toFile(out);

// Logo mark with background keyed out, for favicon / apple icon.
const { data, info } = await sharp(`${S}/logo.jpg`).extract({ left: 470, top: 280, width: 590, height: 590 }).raw().toBuffer({ resolveWithObject: true });
const rgba = Buffer.alloc(info.width * info.height * 4);
for (let i = 0, j = 0; i < data.length; i += 3, j += 4) {
  const d = Math.hypot(data[i] - BG[0], data[i + 1] - BG[1], data[i + 2] - BG[2]);
  const a = Math.min(1, d / 90);
  for (let c = 0; c < 3; c++) rgba[j + c] = a ? Math.max(0, Math.min(255, BG[c] + (data[i + c] - BG[c]) / a)) : 0;
  rgba[j + 3] = Math.round(a * 255);
}
const mark = sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } });
await mark.clone().resize(64).png().toFile('app/icon.png');
await sharp({ create: { width: 180, height: 180, channels: 4, background: '#1a1f28' } })
  .composite([{ input: await mark.clone().resize(140).png().toBuffer(), gravity: 'center' }]).png().toFile('app/apple-icon.png');

// Open Graph image: full logo centered on its own background color.
await sharp({ create: { width: 1200, height: 630, channels: 3, background: { r: BG[0], g: BG[1], b: BG[2] } } })
  .composite([{ input: await sharp(`${S}/logo.jpg`).resize(630).toBuffer(), gravity: 'center' }]).jpeg({ quality: 82 }).toFile('app/opengraph-image.jpg');

// Team portraits.
for (const [src, out] of [['ghased.jpg', 'javad'], ['akmali.png', 'mohammadreza'], ['naghavi.jpg', 'danial']])
  await webp(sharp(`${S}/${src}`).resize(480, 600, { fit: 'cover', position: 'attention' }), `${P}/team/${out}.webp`);

// Brand & graphic work from makmali.ir.
const M = `${S}/makmali`;
const brand = {
  'logo-sayna': 'Logo_003.jpg', 'logo-gishot': 'Logo_01.jpg', 'logo-theater': 'Logo_02.jpg',
  'logo-rezvaniyon': 'Logo_03.jpg', 'logo-vatan': 'Logo_04.jpg', 'logo-azizzadeh': 'Logo_05.jpg',
  'logo-fakhraei': 'Logo_06.jpg', 'logo-paytakht': 'Logo_07.jpg', 'logo-salor': 'Logo_08.jpg',
};
for (const [out, src] of Object.entries(brand)) await webp(sharp(`${M}/${src}`).resize(560), `${P}/brand/${out}.webp`);
const print = {
  'poster-aban': ['Poster_Small_Aban-2.jpg', 560, 700], 'poster-awakening': ['Poster_Small_Ahes11.jpg', 560, 700],
  'poster-weapon': ['Poster_Small_es11.jpg', 560, 700], 'poster-hope': ['Poster_Small_Final.jpg', 1120, 700],
  'catalog-fortexa': ['catalog_Small.jpg', 875, 700], 'catalog-vatan': ['catalog_Small1.jpg', 1050, 700],
  'catalog-alphabet': ['catalog_Small2.jpg', 875, 700], 'book-kids': ['books_Kids_Helal-Ahmar.jpg', 933, 700],
  'book-blockchain': ['books_photo_2023-01-12_15-09-17.jpg', 966, 700],
};
for (const [out, [src, w, h]] of Object.entries(print)) await webp(sharp(`${M}/${src}`).resize(w, h, { fit: 'cover', position: 'attention' }), `${P}/brand/${out}.webp`);

// Project screenshots: _src/shots/<id>-desktop.png and <id>-mobile.png (capture with scripts/shoot.mjs).
// ponytail: missing shots become labeled placeholders; drop real PNGs in and rerun.
const placeholder = (w, h, label) => sharp(Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1d2a3d"/><stop offset="1" stop-color="#123b44"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/><text x="50%" y="${Math.min(h / 2, 500)}" fill="#8fd8e8" font-family="Helvetica" font-size="${w / 18}" text-anchor="middle">${label}</text></svg>`));
for (const id of ['hamyar', 'subchi', 'hitech']) {
  for (const [kind, w, maxH] of [['desktop', 1200, 5200], ['mobile', 600, 6000]]) {
    const src = `${S}/shots/${id}-${kind}.png`;
    let img;
    if (existsSync(src)) {
      img = sharp(src).resize(w);
      const { height } = await sharp(await img.clone().png().toBuffer()).metadata();
      img = sharp(await img.png().toBuffer()).extract({ left: 0, top: 0, width: w, height: Math.min(height, maxH) });
    } else img = placeholder(w, kind === 'desktop' ? 3000 : 2400, `${id} screenshot`);
    const buf = await img.png().toBuffer();
    await webp(sharp(buf), `${P}/work/${id}-${kind}.webp`, 72);
    await webp(sharp(buf).resize(w / 2), `${P}/work/${id}-${kind}-sm.webp`, 70);
  }
}
console.log('assets done');
