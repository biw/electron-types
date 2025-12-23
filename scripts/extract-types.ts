import { execSync } from "child_process";
import { mkdirSync, copyFileSync, writeFileSync, rmSync, existsSync } from "fs";
import { tmpdir } from "os";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = join(__dirname, "..");
const DIST_DIR = join(ROOT_DIR, "dist");

interface NpmPackageInfo {
  version: string;
  dist: {
    tarball: string;
  };
}

async function getPackageInfo(version: string): Promise<NpmPackageInfo> {
  const url = `https://registry.npmjs.org/electron/${version}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch package info for electron@${version}: ${response.statusText}`);
  }
  return response.json();
}

async function getLatestVersion(): Promise<string> {
  const url = "https://registry.npmjs.org/electron/latest";
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch latest version: ${response.statusText}`);
  }
  const data = await response.json();
  return data.version;
}

export async function extractTypes(version: string = "latest"): Promise<string> {
  // Resolve version if "latest"
  const resolvedVersion = version === "latest" ? await getLatestVersion() : version;
  console.log(`Extracting types from electron@${resolvedVersion}...`);

  // Create temp directory
  const tempDir = join(tmpdir(), `electron-types-${resolvedVersion}-${Date.now()}`);
  mkdirSync(tempDir, { recursive: true });

  try {
    // Download tarball using npm pack
    console.log(`Downloading electron@${resolvedVersion}...`);
    execSync(`npm pack electron@${resolvedVersion}`, {
      cwd: tempDir,
      stdio: "pipe",
    });

    // Extract tarball
    const tarballName = `electron-${resolvedVersion}.tgz`;
    console.log(`Extracting ${tarballName}...`);
    execSync(`tar -xzf ${tarballName}`, {
      cwd: tempDir,
      stdio: "pipe",
    });

    // Ensure dist directory exists
    mkdirSync(DIST_DIR, { recursive: true });

    // Copy electron.d.ts to dist
    const sourcePath = join(tempDir, "package", "electron.d.ts");
    const destPath = join(DIST_DIR, "electron.d.ts");

    if (!existsSync(sourcePath)) {
      throw new Error(`electron.d.ts not found in electron@${resolvedVersion}`);
    }

    console.log(`Copying electron.d.ts to dist/...`);
    copyFileSync(sourcePath, destPath);

    // Write version metadata
    const metadataPath = join(DIST_DIR, "version.json");
    writeFileSync(
      metadataPath,
      JSON.stringify(
        {
          electronVersion: resolvedVersion,
          extractedAt: new Date().toISOString(),
        },
        null,
        2
      )
    );

    console.log(`Successfully extracted types from electron@${resolvedVersion}`);
    return resolvedVersion;
  } finally {
    // Cleanup temp directory
    rmSync(tempDir, { recursive: true, force: true });
  }
}

// Run if called directly
const args = process.argv.slice(2);
const version = args[0] || "latest";

extractTypes(version).catch((error) => {
  console.error("Error:", error.message);
  process.exit(1);
});
