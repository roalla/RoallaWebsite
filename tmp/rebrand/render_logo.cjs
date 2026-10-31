const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const [inputSvg, outputPng] = process.argv.slice(2);
if (!inputSvg || !outputPng) {
  throw new Error("Usage: node render_logo.cjs input.svg output.png");
}

fs.mkdirSync(path.dirname(outputPng), { recursive: true });

sharp(inputSvg, { density: 600 })
  .resize(1000, 1000, {
    fit: "contain",
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .png({ compressionLevel: 9, adaptiveFiltering: true })
  .toFile(outputPng)
  .then((info) => {
    process.stdout.write(JSON.stringify(info));
  });
