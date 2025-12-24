interface VersionCheckResult {
  latestElectron: string;
  latestElectronTypes: string | null;
  needsPublish: boolean;
}

async function getLatestElectronVersion(): Promise<string> {
  const response = await fetch("https://registry.npmjs.org/electron/latest");
  if (!response.ok) {
    throw new Error(`Failed to fetch electron version: ${response.statusText}`);
  }
  const data = await response.json();
  return data.version;
}

async function getLatestElectronTypesVersion(): Promise<string | null> {
  const response = await fetch("https://registry.npmjs.org/electron-types/latest");
  if (response.status === 404) {
    // Package doesn't exist yet
    return null;
  }
  if (!response.ok) {
    throw new Error(`Failed to fetch electron-types version: ${response.statusText}`);
  }
  const data = await response.json();
  return data.version;
}

async function checkVersions(): Promise<VersionCheckResult> {
  const [latestElectron, latestElectronTypes] = await Promise.all([
    getLatestElectronVersion(),
    getLatestElectronTypesVersion(),
  ]);

  const needsPublish = latestElectronTypes === null || latestElectron !== latestElectronTypes;

  return {
    latestElectron,
    latestElectronTypes,
    needsPublish,
  };
}

// Run if called directly
const args = process.argv.slice(2);
const jsonOutput = args.includes("--json");

checkVersions()
  .then((result) => {
    if (jsonOutput) {
      console.log(JSON.stringify(result));
    } else {
      console.log(`Latest electron version: ${result.latestElectron}`);
      console.log(`Latest electron-types version: ${result.latestElectronTypes || "(not published)"}`);
      console.log(`Needs publish: ${result.needsPublish ? "yes" : "no"}`);
    }
  })
  .catch((error) => {
    console.error("Error:", error.message);
    process.exit(1);
  });
