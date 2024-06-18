const fs = require("fs");
const path = require("path");
const { compareSlots } = require("./compare-slots");

const outDir = path.join(__dirname, "..", "out");
const prevStorageLayoutFile = path.join(__dirname, "storage-layout-dump.json");

let prevStorageLayout = {};

if (fs.existsSync(prevStorageLayoutFile)) {
  const data = fs.readFileSync(prevStorageLayoutFile, "utf8");
  prevStorageLayout = JSON.parse(data);
  console.log(
    "Previous storage layout loaded: ",
    Object.keys(prevStorageLayout).length,
  );
}

const prevFiles = Object.keys(prevStorageLayout);

const files = fs
  .readdirSync(outDir)
  .map((dir) => {
    if (
      !fs.lstatSync(path.join(outDir, dir)).isDirectory() ||
      dir === "build-info"
    ) {
      return "";
    }
    return fs.readdirSync(path.join(outDir, dir)).map((file) => {
      return path.join(dir, file);
    });
  })
  .flat()
  .filter((val) => val !== "");

const storageLayout = {};
let brokenState = false;

for (const file of files) {
  const filePath = path.join(outDir, file);
  if (fs.lstatSync(path.join(filePath)).isDirectory()) {
    // for /out/contracts/CBOR.sol/CBOR.json
    continue;
  }
  const data = fs.readFileSync(filePath, "utf8");
  const json = JSON.parse(data);
  const layout = json.storageLayout?.storage ?? [];
  storageLayout[file] = layout;
  if (!prevFiles.includes(file)) {
    console.log("New file: ", file);
  } else {
    const prev = prevStorageLayout[file];
    const curr = storageLayout[file];
    if (JSON.stringify(prev) !== JSON.stringify(curr)) {
      console.log("Updated file: ", file);
      const compare = compareSlots(prev, curr);
      if (compare.length > 0) {
        brokenState = true;
        console.log(compare);
      }
    }
  }
  prevFiles.splice(prevFiles.indexOf(file), 1);
}

if (prevFiles.length > 0) {
  console.log("Files deleted: ");
  console.log(prevFiles);
  brokenState = true;
}

if (brokenState) {
  process.exit(1);
}

process.exit(0);
