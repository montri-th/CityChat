import { createHash } from 'node:crypto';
import {
  existsSync,
  lstatSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const toolsRoot = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(toolsRoot, '..');
const configPath = path.join(repositoryRoot, 'release.config.json');
const config = JSON.parse(readFileSync(configPath, 'utf8'));
const deploymentRoot = path.resolve(repositoryRoot, config.deployment.root);
const manifestRelativePath = normalizeRelativePath(config.deployment.manifest);
const checksumsRelativePath = normalizeRelativePath(config.deployment.checksums);
const manifestPath = resolveDeploymentPath(manifestRelativePath);
const checksumsPath = resolveDeploymentPath(checksumsRelativePath);
const checkOnly = process.argv.includes('--check');

function normalizeRelativePath(value) {
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`Expected a non-empty deployment-relative path, received ${String(value)}`);
  }

  if (
    path.isAbsolute(value)
    || value.includes('\\')
    || value.split('/').some((segment) => segment === '' || segment === '.' || segment === '..')
  ) {
    throw new Error(`Unsafe deployment-relative path: ${value}`);
  }

  return value;
}

function resolveDeploymentPath(relativePath) {
  const absolutePath = path.resolve(deploymentRoot, relativePath);
  const relation = path.relative(deploymentRoot, absolutePath);

  if (relation.startsWith('..') || path.isAbsolute(relation)) {
    throw new Error(`Path leaves the deployment root: ${relativePath}`);
  }

  return absolutePath;
}

function sha256(buffer) {
  return createHash('sha256').update(buffer).digest('hex');
}

function listDeploymentFiles(directory = deploymentRoot) {
  const files = [];

  for (const entry of readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0)) {
    const absolutePath = path.join(directory, entry.name);
    const relativePath = path.relative(deploymentRoot, absolutePath).split(path.sep).join('/');
    const stat = lstatSync(absolutePath);

    if (stat.isSymbolicLink()) {
      throw new Error(`Deployment tree must not contain symlinks: ${relativePath}`);
    }

    if (entry.isDirectory()) {
      files.push(...listDeploymentFiles(absolutePath));
      continue;
    }

    if (!entry.isFile()) {
      throw new Error(`Deployment tree contains a non-regular file: ${relativePath}`);
    }

    if (entry.name === '.DS_Store') {
      throw new Error(`Deployment tree contains an operating-system metadata file: ${relativePath}`);
    }

    files.push(relativePath);
  }

  return files.sort();
}

function assertRegularFile(relativePath) {
  const normalized = normalizeRelativePath(relativePath);
  const absolutePath = resolveDeploymentPath(normalized);

  if (!existsSync(absolutePath)) {
    throw new Error(`Required deployment file is missing: ${normalized}`);
  }

  const stat = lstatSync(absolutePath);
  if (stat.isSymbolicLink() || !stat.isFile()) {
    throw new Error(`Required deployment path must be a regular file: ${normalized}`);
  }
}

for (const relativePath of config.deployment.requiredFiles) {
  assertRegularFile(relativePath);
}

for (const [relativePath, expectedHash] of Object.entries(config.pinnedInputs)) {
  assertRegularFile(relativePath);
  const actualHash = sha256(readFileSync(resolveDeploymentPath(normalizeRelativePath(relativePath))));
  if (actualHash !== expectedHash) {
    throw new Error(`Pinned input hash mismatch for ${relativePath}: expected ${expectedHash}, received ${actualHash}`);
  }
}

const generatedPaths = new Set([manifestRelativePath, checksumsRelativePath]);
const sourcePaths = listDeploymentFiles().filter((relativePath) => !generatedPaths.has(relativePath));
const fileRecords = sourcePaths.map((relativePath) => {
  const bytes = readFileSync(resolveDeploymentPath(relativePath));
  return {
    path: relativePath,
    bytes: bytes.byteLength,
    sha256: sha256(bytes),
  };
});

const manifest = {
  schemaVersion: '1.0',
  artifact: config.artifact,
  publication: config.publication,
  generatedBy: 'tools/finalize-release.mjs',
  totals: {
    files: fileRecords.length,
    bytes: fileRecords.reduce((sum, record) => sum + record.bytes, 0),
  },
  files: fileRecords,
};

const manifestText = `${JSON.stringify(manifest, null, 2)}\n`;
const manifestRecord = {
  path: manifestRelativePath,
  sha256: sha256(Buffer.from(manifestText)),
};
const checksumRecords = [
  ...fileRecords.map(({ path: relativePath, sha256: hash }) => ({ path: relativePath, sha256: hash })),
  manifestRecord,
].sort((a, b) => a.path < b.path ? -1 : a.path > b.path ? 1 : 0);
const checksumsText = `${checksumRecords.map(({ path: relativePath, sha256: hash }) => `${hash}  ${relativePath}`).join('\n')}\n`;

if (checkOnly) {
  const stale = [];

  if (!existsSync(manifestPath) || readFileSync(manifestPath, 'utf8') !== manifestText) {
    stale.push(manifestRelativePath);
  }
  if (!existsSync(checksumsPath) || readFileSync(checksumsPath, 'utf8') !== checksumsText) {
    stale.push(checksumsRelativePath);
  }

  if (stale.length > 0) {
    throw new Error(`Release metadata is stale or missing: ${stale.join(', ')}. Run npm run finalize.`);
  }

  console.log(`Release metadata is current (${fileRecords.length} deployable files, ${manifest.totals.bytes} bytes).`);
} else {
  writeFileSync(manifestPath, manifestText);
  writeFileSync(checksumsPath, checksumsText);
  console.log(`Finalized ${fileRecords.length} deployable files (${manifest.totals.bytes} bytes).`);
}
