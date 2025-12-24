interface ElectronRelease {
  version: string;
  date: string;
}

interface VersionCheckResult {
  versionsToPublish: string[];
  stableVersions: string[];
  prereleaseVersions: string[];
}

async function getElectronReleases(): Promise<ElectronRelease[]> {
  const response = await fetch("https://releases.electronjs.org/releases.json");
  if (!response.ok) {
    throw new Error(`Failed to fetch electron releases: ${response.statusText}`);
  }
  return response.json();
}

async function getPublishedElectronTypesVersions(): Promise<Set<string>> {
  const response = await fetch("https://registry.npmjs.org/electron-types");
  if (response.status === 404) {
    // Package doesn't exist yet
    return new Set();
  }
  if (!response.ok) {
    throw new Error(`Failed to fetch electron-types versions: ${response.statusText}`);
  }
  const data = await response.json();
  return new Set(Object.keys(data.versions || {}));
}

function isNightly(version: string): boolean {
  return version.includes("nightly");
}

function isPrerelease(version: string): boolean {
  return version.includes("-alpha") || version.includes("-beta");
}

function getMajorVersion(version: string): number {
  return parseInt(version.split(".")[0], 10);
}

/**
 * Get the latest stable version for each of the top N major versions.
 * This matches what's shown on releases.electronjs.org (currently 3 supported majors).
 */
function getLatestStablePerMajor(releases: ElectronRelease[], numMajors: number = 3): string[] {
  const stableReleases = releases.filter((r) => !isNightly(r.version) && !isPrerelease(r.version));

  // Group by major version and take the first (latest) from each
  const latestByMajor = new Map<number, string>();
  for (const release of stableReleases) {
    const major = getMajorVersion(release.version);
    if (!latestByMajor.has(major)) {
      latestByMajor.set(major, release.version);
    }
  }

  // Sort by major version descending and take top N
  const sortedMajors = Array.from(latestByMajor.entries())
    .sort((a, b) => b[0] - a[0])
    .slice(0, numMajors);

  return sortedMajors.map(([, version]) => version);
}

/**
 * Get the latest prerelease version for major versions newer than the latest stable.
 * This matches what's shown on releases.electronjs.org (prereleases for upcoming major).
 */
function getLatestPrereleases(releases: ElectronRelease[], latestStableMajor: number): string[] {
  const prereleases = releases.filter((r) => !isNightly(r.version) && isPrerelease(r.version));

  // Only include prereleases for majors newer than the latest stable
  const latestByMajor = new Map<number, string>();
  for (const release of prereleases) {
    const major = getMajorVersion(release.version);
    if (major > latestStableMajor && !latestByMajor.has(major)) {
      latestByMajor.set(major, release.version);
    }
  }

  // Sort by major version descending
  const sortedMajors = Array.from(latestByMajor.entries()).sort((a, b) => b[0] - a[0]);

  return sortedMajors.map(([, version]) => version);
}

async function checkVersions(): Promise<VersionCheckResult> {
  const [releases, publishedVersions] = await Promise.all([
    getElectronReleases(),
    getPublishedElectronTypesVersions(),
  ]);

  // Get top 3 stable versions (matches releases.electronjs.org)
  const stableVersions = getLatestStablePerMajor(releases, 3);

  // Find the latest stable major to determine which prereleases to include
  const latestStableMajor = stableVersions.length > 0 ? getMajorVersion(stableVersions[0]) : 0;

  // Get prereleases for upcoming major versions only
  const prereleaseVersions = getLatestPrereleases(releases, latestStableMajor);

  const allTargetVersions = [...stableVersions, ...prereleaseVersions];
  const versionsToPublish = allTargetVersions.filter((v) => !publishedVersions.has(v));

  return {
    versionsToPublish,
    stableVersions,
    prereleaseVersions,
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
      console.log(`Stable versions: ${result.stableVersions.join(", ")}`);
      console.log(`Prerelease versions: ${result.prereleaseVersions.join(", ") || "(none)"}`);
      console.log(`Versions to publish: ${result.versionsToPublish.length > 0 ? result.versionsToPublish.join(", ") : "(none)"}`);
    }
  })
  .catch((error) => {
    console.error("Error:", error.message);
    process.exit(1);
  });
