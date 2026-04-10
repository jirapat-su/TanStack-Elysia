import { existsSync, readdirSync, rmSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(fileURLToPath(import.meta.url), "..", "..");

const DIRS_TO_REMOVE = [
  "node_modules",
  ".turbo",
  ".next",
  ".output",
  "dist",
  ".tanstack",
];
const FILES_TO_REMOVE = [
  "bun.lock",
  "package-lock.json",
  "yarn.lock",
  "pnpm-lock.yaml",
];

function findAndRemoveDirs(base, targets) {
  if (!existsSync(base)) return;

  for (const entry of readdirSync(base)) {
    const fullPath = join(base, entry);

    try {
      if (!statSync(fullPath).isDirectory()) continue;
    } catch {
      continue;
    }

    if (targets.includes(entry)) {
      console.log(`  rm ${fullPath}`);
      rmSync(fullPath, { recursive: true, force: true });
      continue;
    }

    findAndRemoveDirs(fullPath, targets);
  }
}

function removeFiles(base, files) {
  for (const file of files) {
    const fullPath = join(base, file);
    if (existsSync(fullPath)) {
      console.log(`  rm ${fullPath}`);
      rmSync(fullPath, { force: true });
    }
  }
}

console.log("Cleaning directories...");
findAndRemoveDirs(ROOT, DIRS_TO_REMOVE);

console.log("Cleaning lock files...");
removeFiles(ROOT, FILES_TO_REMOVE);

console.log("Done.");
