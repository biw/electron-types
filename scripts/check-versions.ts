interface ElectronRelease {
  version: string;
  date: string;
}

interface NpmPackageMetadata {
  versions: Record<string, unknown>;
  time: Record<string, string>;
}

interface VersionCheckResult {
  versionsToPublish: string[];
  stableVersions: string[];
  prereleaseVersions: string[];
  unpublishedElectronVersions: string[];
  backlogVersions: string[];
}

async function getElectronReleases(): Promise<ElectronRelease[]> {
  const response = await fetch("https://releases.electronjs.org/releases.json");
  if (!response.ok) {
    throw new Error(`Failed to fetch electron releases: ${response.statusText}`);
  }
  return response.json();
}

async function getPublishedElectronTypesVersions(): Promise<{
  versions: Set<string>;
  createdAt?: string;
}> {
  const response = await fetch("https://registry.npmjs.org/electron-types");
  if (response.status === 404) {
    // Package doesn't exist yet
    return { versions: new Set() };
  }
  if (!response.ok) {
    throw new Error(`Failed to fetch electron-types versions: ${response.statusText}`);
  }
  const data = (await response.json()) as NpmPackageMetadata;
  return {
    versions: new Set(Object.keys(data.versions || {})),
    createdAt: data.time?.created,
  };
}

async function getPublishedElectronVersions(): Promise<NpmPackageMetadata> {
  const response = await fetch("https://registry.npmjs.org/electron");
  if (!response.ok) {
    throw new Error(`Failed to fetch Electron versions from npm: ${response.statusText}`);
  }
  return response.json();
}

function isNightly(version: string): boolean {
  return version.includes("nightly");
}

function isPrerelease(version: string): boolean {
  return version.includes("-alpha") || version.includes("-beta");
}

function isSupportedRelease(version: string): boolean {
  return !isNightly(version) && (!version.includes("-") || isPrerelease(version));
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
  const [releases, publishedElectronTypes, publishedElectron] = await Promise.all([
    getElectronReleases(),
    getPublishedElectronTypesVersions(),
    getPublishedElectronVersions(),
  ]);

  // Get top 3 stable versions (matches releases.electronjs.org)
  const stableVersions = getLatestStablePerMajor(releases, 3);

  // Find the latest stable major to determine which prereleases to include
  const latestStableMajor = stableVersions.length > 0 ? getMajorVersion(stableVersions[0]) : 0;

  // Get prereleases for upcoming major versions only
  const prereleaseVersions = getLatestPrereleases(releases, latestStableMajor);

  const currentTargetVersions = [...stableVersions, ...prereleaseVersions];
  const publishedElectronVersionSet = new Set(Object.keys(publishedElectron.versions || {}));
  const unpublishedElectronVersions = currentTargetVersions.filter(
    (version) => !publishedElectronVersionSet.has(version)
  );

  // Backfill every stable, alpha, and beta Electron release published after this package began.
  // npm is authoritative here: the Electron release feed can include incomplete release builds.
  const electronTypesCreatedAt = publishedElectronTypes.createdAt;
  const backlogVersions = electronTypesCreatedAt
    ? Array.from(publishedElectronVersionSet).filter(
        (version) =>
          publishedElectron.time[version] >= electronTypesCreatedAt &&
          isSupportedRelease(version) &&
          !publishedElectronTypes.versions.has(version)
      )
    : [];
  const allTargetVersions = [...new Set([...currentTargetVersions, ...backlogVersions])];
  const versionsToPublish = allTargetVersions.filter(
    (version) => publishedElectronVersionSet.has(version) && !publishedElectronTypes.versions.has(version)
  );

  return {
    versionsToPublish,
    stableVersions,
    prereleaseVersions,
    unpublishedElectronVersions,
    backlogVersions,
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
      console.log(`Not yet published to npm: ${result.unpublishedElectronVersions.join(", ") || "(none)"}`);
      console.log(`Backfill versions: ${result.backlogVersions.join(", ") || "(none)"}`);
      console.log(`Versions to publish: ${result.versionsToPublish.length > 0 ? result.versionsToPublish.join(", ") : "(none)"}`);
    }
  })
  .catch((error) => {
    console.error("Error:", error.message);
    process.exit(1);
  });
