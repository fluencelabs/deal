const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'out');
const storageLayoutFile = path.join('ci/', 'storage-layout.json');

const files = fs.readdirSync(outDir).map((dir) => {
  if (!fs.lstatSync(path.join(outDir, dir)).isDirectory()) {
    return '';
  }
  return fs.readdirSync(path.join(outDir, dir)).map((file) => {
    return path.join(dir, file);
  });
}).flat().filter((val) => val !== '');

const storageLayout = {};

for (const file of files) {
  const filePath = path.join(outDir, file);
  if (fs.lstatSync(path.join(filePath)).isDirectory()) {
    // for /out/contracts/CBOR.sol/CBOR.json
    continue;
  }
  const data = fs.readFileSync(filePath, 'utf8');
  const json = JSON.parse(data);
  const layout = json.storageLayout.storage;
  storageLayout[file] = layout;
}

fs.writeFileSync(storageLayoutFile, JSON.stringify(storageLayout, null, 2));
console.log("Storage layout saved!");
