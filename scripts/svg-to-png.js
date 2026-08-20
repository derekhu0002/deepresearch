const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const svgPath = path.join(__dirname, '..', 'docs', 'insights', '有声书-有感情朗读-banner-v2.svg');
const pngPath = path.join(__dirname, '..', 'docs', 'insights', '有声书-有感情朗读-banner-v2.png');

const svgBuffer = fs.readFileSync(svgPath);

sharp(svgBuffer)
  .resize(1200, 400)
  .png()
  .toFile(pngPath)
  .then(() => {
    console.log(`Converted: ${pngPath}`);
  })
  .catch(err => {
    console.error('Conversion failed:', err);
    process.exit(1);
  });
