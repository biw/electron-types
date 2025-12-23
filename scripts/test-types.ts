import { execSync } from "child_process";
import { mkdirSync, writeFileSync, rmSync, existsSync, readFileSync } from "fs";
import { tmpdir } from "os";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = join(__dirname, "..");
const DIST_DIR = join(ROOT_DIR, "dist");

function testTypes(): void {
  console.log("Testing electron types...");

  // Verify electron.d.ts exists
  const dtsPath = join(DIST_DIR, "electron.d.ts");
  if (!existsSync(dtsPath)) {
    throw new Error("electron.d.ts not found in dist/. Run 'yarn build' first.");
  }

  // Read the d.ts file to verify it has content
  const dtsContent = readFileSync(dtsPath, "utf-8");
  if (dtsContent.length < 1000) {
    throw new Error("electron.d.ts appears to be too small or empty");
  }

  // Check for key Electron types in the file
  const requiredTypes = [
    "declare namespace Electron",
    "interface App",
    "interface BrowserWindow",
    "interface WebContents",
    "interface IpcMain",
    "interface IpcRenderer",
  ];

  for (const type of requiredTypes) {
    if (!dtsContent.includes(type)) {
      throw new Error(`Required type declaration not found: ${type}`);
    }
  }

  console.log("All required types found in electron.d.ts");

  // Create temp directory for type compilation test
  const tempDir = join(tmpdir(), `electron-types-test-${Date.now()}`);
  mkdirSync(tempDir, { recursive: true });

  try {
    // Create a test TypeScript file that uses electron types
    const testFilePath = join(tempDir, "test.ts");
    const testFileContent = `/// <reference path="${dtsPath}" />

// Test that basic Electron types are available
type TestApp = Electron.App;
type TestBrowserWindow = Electron.BrowserWindow;
type TestWebContents = Electron.WebContents;
type TestIpcMain = Electron.IpcMain;
type TestIpcRenderer = Electron.IpcRenderer;
type TestDialog = Electron.Dialog;
type TestMenu = Electron.Menu;
type TestMenuItem = Electron.MenuItem;
type TestSession = Electron.Session;
type TestShell = Electron.Shell;

// Test that event types work
type TestEvent = Electron.Event;

// Test that common interfaces are available
type TestBrowserWindowOptions = Electron.BrowserWindowConstructorOptions;
type TestWebPreferences = Electron.WebPreferences;

// Dummy export to make it a module
export {};
`;

    writeFileSync(testFilePath, testFileContent);

    // Run TypeScript compiler from the project root to validate types
    console.log("Running TypeScript compiler...");
    try {
      // Use yarn to run tsc from the project root, pointing to our temp file
      execSync(`yarn tsc --noEmit --skipLibCheck --target ES2022 --module NodeNext --moduleResolution NodeNext ${testFilePath}`, {
        cwd: ROOT_DIR,
        stdio: "pipe",
      });
      console.log("All type checks passed!");
    } catch (error: unknown) {
      const execError = error as { stdout?: Buffer; stderr?: Buffer };
      const stdout = execError.stdout?.toString() || "";
      const stderr = execError.stderr?.toString() || "";
      throw new Error(`Type check failed:\n${stdout}\n${stderr}`);
    }
  } finally {
    // Cleanup temp directory
    rmSync(tempDir, { recursive: true, force: true });
  }
}

// Run if called directly
try {
  testTypes();
} catch (error: unknown) {
  const err = error as Error;
  console.error("Error:", err.message);
  process.exit(1);
}
