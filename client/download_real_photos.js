import fs from 'fs';
import path from 'path';

const outDir = 'C:/Users/dilip/.gemini/antigravity/scratch/retroparts/client/public/parts';
fs.mkdirSync(outDir, { recursive: true });

const targetFiles = [
  { name: 'spark-plug.jpg', wikiTitle: 'File:Sparkplug.jpg' },
  { name: 'carburetor.jpg', wikiTitle: 'File:Carburetor 01.jpg' },
  { name: 'brake-rotor.jpg', wikiTitle: 'File:Ventilated-disc with slitted.jpg' },
  { name: 'cylinder-piston.jpg', wikiTitle: 'File:Piston and connecting rod.jpg' },
  { name: 'crankshaft.jpg', wikiTitle: 'File:Crankshaft.jpg' },
  { name: 'exhaust-header.jpg', wikiTitle: 'File:Exhaust manifold.jpg' },
  { name: 'speedometer.jpg', wikiTitle: 'File:Speedometer.jpg' },
  { name: 'headlight.jpg', wikiTitle: 'File:Lucas 7-inch headlamp.jpg' },
  { name: 'suspension-coilover.jpg', wikiTitle: 'File:Coilover suspension.jpg' },
  { name: 'chrome-grille.jpg', wikiTitle: 'File:Vintage car radiator grille.jpg' },
];

async function download() {
  for (const item of targetFiles) {
    try {
      console.log(`Resolving URL for ${item.wikiTitle}...`);
      const apiUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(item.wikiTitle)}&prop=imageinfo&iiprop=url&format=json`;
      const res = await fetch(apiUrl, { headers: { 'User-Agent': 'RetroPartsBot/1.0 (contact@retroparts.com)' } });
      const data = await res.json();
      const pages = data.query?.pages || {};
      const page = Object.values(pages)[0];
      const imgUrl = page?.imageinfo?.[0]?.url;

      if (imgUrl) {
        console.log(`Downloading ${item.name} from ${imgUrl}...`);
        const imgRes = await fetch(imgUrl, { headers: { 'User-Agent': 'RetroPartsBot/1.0 (contact@retroparts.com)' } });
        if (imgRes.ok) {
          const buffer = Buffer.from(await imgRes.arrayBuffer());
          const dest = path.join(outDir, item.name);
          fs.writeFileSync(dest, buffer);
          console.log(`✓ Successfully saved ${item.name} (${buffer.length} bytes)`);
        } else {
          console.warn(`Failed HTTP ${imgRes.status} for ${item.name}`);
        }
      } else {
        console.warn(`No URL found for ${item.wikiTitle}`);
      }
    } catch (err) {
      console.error(`Error downloading ${item.name}:`, err);
    }
  }
}

download();
