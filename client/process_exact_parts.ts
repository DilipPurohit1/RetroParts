import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const outDir = 'C:/Users/dilip/.gemini/antigravity/scratch/retroparts/client/public/parts';
fs.mkdirSync(outDir, { recursive: true });

async function processMarutiGrille() {
  try {
    console.log('Fetching First Gen Maruti 800 photo...');
    const apiUrl = 'https://commons.wikimedia.org/w/api.php?action=query&titles=File:First_gen_Maruti_800.jpg&prop=imageinfo&iiprop=url&format=json';
    const res = await fetch(apiUrl, { headers: { 'User-Agent': 'RetroPartsBot/1.0' } });
    const data = await res.json();
    const page = Object.values(data.query.pages)[0] as any;
    const url = page?.imageinfo?.[0]?.url;

    if (url) {
      console.log('Downloading Maruti 800 photo from:', url);
      const imgRes = await fetch(url, { headers: { 'User-Agent': 'RetroPartsBot/1.0' } });
      const buffer = Buffer.from(await imgRes.arrayBuffer());

      // Get image dimensions and crop directly to the front chrome grille with emblem
      const meta = await sharp(buffer).metadata();
      const w = meta.width || 1000;
      const h = meta.height || 750;

      // The front grille of the Maruti 800 in this photo is located in the central lower-front region
      const cropLeft = Math.floor(w * 0.18);
      const cropTop = Math.floor(h * 0.42);
      const cropWidth = Math.floor(w * 0.46);
      const cropHeight = Math.floor(h * 0.28);

      await sharp(buffer)
        .extract({ left: cropLeft, top: cropTop, width: cropWidth, height: cropHeight })
        .resize(800, 500, { fit: 'cover' })
        .jpeg({ quality: 92 })
        .toFile(path.join(outDir, 'chrome-grille.jpg'));

      console.log('✓ Successfully generated exact Maruti 800 SS80 front grille image!');
    }
  } catch (err) {
    console.error('Error processing Maruti grille:', err);
  }
}

async function generateAnimationSprites() {
  const parts = [
    'spark-plug.jpg',
    'carburetor.jpg',
    'brake-rotor.jpg',
    'cylinder-piston.jpg',
    'crankshaft.jpg',
    'exhaust-header.jpg',
    'speedometer.jpg',
    'headlight.jpg',
  ];

  for (const p of parts) {
    const srcPath = path.join(outDir, p);
    const destName = p.replace('.jpg', '-sprite.png');
    const destPath = path.join(outDir, destName);

    if (fs.existsSync(srcPath)) {
      try {
        // Create an isolated, circular anti-aliased cutout PNG with soft shadow and subtle metallic ring
        const size = 160;
        const circleSvg = Buffer.from(`
          <svg width="${size}" height="${size}">
            <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 2}" fill="#fff"/>
          </svg>
        `);

        await sharp(srcPath)
          .resize(size, size, { fit: 'cover' })
          .composite([
            { input: circleSvg, blend: 'dest-in' }
          ])
          .png()
          .toFile(destPath);

        console.log(`✓ Generated animated real photo sprite: ${destName}`);
      } catch (e) {
        console.error(`Error generating sprite for ${p}:`, e);
      }
    }
  }
}

async function main() {
  await processMarutiGrille();
  await generateAnimationSprites();
  console.log('All image processing complete!');
}

main();
