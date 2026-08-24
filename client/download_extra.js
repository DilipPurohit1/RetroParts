import fs from 'fs';
import path from 'path';

const outDir = 'C:/Users/dilip/.gemini/antigravity/scratch/retroparts/client/public/parts';

const downloads = [
  {
    name: 'rear-spoiler.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/5/5f/Rear_spoiler_%2840258225393%29.jpg',
  },
  {
    name: 'gearbox.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/0/0a/2WD_FF_transmission.jpg',
  },
  {
    name: 'chrome-grille.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/4/49/Routemaster_radiator_grille.jpg',
  },
  {
    name: 'distributor.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/d/dc/Distributor_Cap_%282900124881%29.jpg',
  },
];

async function run() {
  for (const item of downloads) {
    try {
      console.log(`Downloading ${item.name}...`);
      const res = await fetch(item.url, { headers: { 'User-Agent': 'RetroPartsBot/1.0 (contact@retroparts.com)' } });
      if (res.ok) {
        const buf = Buffer.from(await res.arrayBuffer());
        fs.writeFileSync(path.join(outDir, item.name), buf);
        console.log(`✓ Saved ${item.name} (${buf.length} bytes)`);
      } else {
        console.warn(`HTTP ${res.status} for ${item.name}`);
      }
    } catch (e) {
      console.error(`Error for ${item.name}`, e);
    }
  }
}

run();
