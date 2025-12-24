import { readFileSync, writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { extractTypes } from "./extract-types.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = join(__dirname, "..");
const DIST_DIR = join(ROOT_DIR, "dist");
const PACKAGE_JSON_PATH = join(ROOT_DIR, "package.json");
const README_PATH = join(ROOT_DIR, "README.md");

async function build(version: string = "latest"): Promise<void> {
  console.log(`Building electron-types for version: ${version}`);

  // Extract types from electron
  const resolvedVersion = await extractTypes(version);

  // Validate that electron.d.ts exists
  const dtsPath = join(DIST_DIR, "electron.d.ts");
  if (!existsSync(dtsPath)) {
    throw new Error("electron.d.ts not found in dist/ after extraction");
  }

  // Update package.json version to match electron version
  const packageJson = JSON.parse(readFileSync(PACKAGE_JSON_PATH, "utf-8"));
  packageJson.version = resolvedVersion;
  writeFileSync(PACKAGE_JSON_PATH, JSON.stringify(packageJson, null, 2) + "\n");

  // Update README.md to add version to install commands
  let readme = readFileSync(README_PATH, "utf-8");
  // Replace install commands with version-specific ones
  readme = readme.replace(
    /npm install -D electron-types\n/g,
    `npm install -D electron-types@${resolvedVersion}\n`
  );
  readme = readme.replace(
    /yarn add -D electron-types\n/g,
    `yarn add -D electron-types@${resolvedVersion}\n`
  );
  readme = readme.replace(
    /pnpm add -D electron-types\n/g,
    `pnpm add -D electron-types@${resolvedVersion}\n`
  );
  writeFileSync(README_PATH, readme);

  console.log(`Updated package.json version to ${resolvedVersion}`);
  console.log(`Updated README.md with version ${resolvedVersion}`);
  console.log("Build complete!");
}

// Run if called directly
const args = process.argv.slice(2);
const version = args[0] || "latest";

build(version).catch((error) => {
  console.error("Error:", error.message);
  process.exit(1);
});
