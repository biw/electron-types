# electron-types

TypeScript type definitions extracted from the [electron](https://www.electronjs.org/) package.

## Why?

The official `electron` package is ~200MB because it includes the Electron binary. If you only need TypeScript types (e.g., for type-checking code that will run in an Electron context), this package provides just the type definitions (~1MB).

## Installation

Since this package only provides TypeScript types, install it as a dev dependency:

```bash
npm install -D electron-types
# or
yarn add -D electron-types
# or
pnpm add -D electron-types
```

## Usage

The types are available via the `Electron` namespace:

```typescript
// Types are available via the Electron namespace
const win: Electron.BrowserWindow = /* ... */;
const app: Electron.App = /* ... */;
```

For projects that need to reference the types in a `.d.ts` file:

```typescript
/// <reference types="electron-types" />

declare const myWindow: Electron.BrowserWindow;
```

## Version Matching

This package's version matches the electron version it was extracted from. For example, `electron-types@39.2.7` contains types from `electron@39.2.7`.

## How It Works

This package is automatically updated via CI:

1. A scheduled GitHub Action checks for new electron releases every 6 hours
2. When a new version is detected, it downloads the electron package
3. Extracts the `electron.d.ts` type definitions
4. Publishes to npm using [Trusted Publisher](https://docs.npmjs.com/generating-provenance-statements#publishing-packages-with-provenance-via-github-actions) (OIDC) with provenance attestation

## Development

```bash
# Install dependencies
yarn install

# Extract types from latest electron
yarn extract

# Extract types from a specific version
yarn extract 39.2.7

# Build package for a specific version (extract + update version)
yarn build 39.2.7

# Test that types work correctly
yarn test

# Check if a new version needs to be published
yarn check-versions
```

## License

MIT - Same as Electron

The type definitions are extracted from the Electron project, which is licensed under the MIT license.
