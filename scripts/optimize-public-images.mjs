import { readdir } from "node:fs/promises";
import { join, parse } from "node:path";
import sharp from "sharp";

const imagesDir = join(process.cwd(), "public", "images");
const supported = new Set([".jpg", ".jpeg", ".png"]);

const files = await readdir(imagesDir);
const targets = files.filter((file) => supported.has(parse(file).ext.toLowerCase()));

for (const file of targets) {
  const parsed = parse(file);
  const input = join(imagesDir, file);
  const output = join(imagesDir, `${parsed.name}.webp`);

  await sharp(input)
    .resize({
      width: 1200,
      withoutEnlargement: true,
    })
    .webp({
      quality: 72,
      effort: 6,
    })
    .toFile(output);

  console.log(`Optimized ${file} -> ${parsed.name}.webp`);
}
