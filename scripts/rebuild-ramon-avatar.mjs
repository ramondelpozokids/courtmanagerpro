import fs from 'fs';
import sharp from 'sharp';

const src = 'public/images/avatar-ceo-ramon.png';

await sharp(src)
  .resize(256, 256, { fit: 'cover', position: 'top' })
  .jpeg({ quality: 88 })
  .toFile('public/images/avatar-ceo-ramon.jpg');

const buf = await sharp(src)
  .resize(128, 128, { fit: 'cover', position: 'top' })
  .jpeg({ quality: 80 })
  .toBuffer();

const data = `data:image/jpeg;base64,${buf.toString('base64')}`;
fs.writeFileSync(
  'src/components/layout/ramon-avatar-data.ts',
  `/** Foto CEO limpia (sin N). */\nexport const RAMON_AVATAR_DATA_URL =\n  '${data}';\n`
);

fs.copyFileSync(src, 'public/images/ramon-avatar.png');
fs.copyFileSync(src, 'public/images/ramon-del-pozo.png');

console.log({
  jpg: fs.statSync('public/images/avatar-ceo-ramon.jpg').size,
  dataUrl: data.length,
  png: fs.statSync('public/images/ramon-avatar.png').size,
});
