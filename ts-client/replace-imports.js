import shx from "shelljs";
shx.exec(
  "sed -i '' -e 's|from \"\\./\\([^/]*\\)\\.sol\"|from \"./\\1.sol/index.js\"|g' ./src/typechain-types/index.ts",
);
