#!/usr/bin/env node
/**
 * check-utf8.mjs
 *
 * Scans project source files and validates that every file can be decoded as
 * UTF-8.  Exits with code 1 and lists offending files when invalid bytes are
 * found.
 *
 * Usage:
 *   node scripts/check-utf8.mjs
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;

/** Glob-style patterns for directories to skip entirely */
const SKIP_DIRS = new Set([
  "node_modules",
  ".git",
  ".next",
  "out",
  "dist",
  "build",
  ".turbo",
  "coverage",
]);

/** File extensions to check */
const CHECK_EXTENSIONS = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
  ".json",
  ".md",
  ".yml",
  ".yaml",
  ".css",
  ".html",
]);

/**
 * Recursively collect all files under `dir` that match CHECK_EXTENSIONS.
 * @param {string} dir
 * @returns {string[]}
 */
function collectFiles(dir) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue;
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      results.push(...collectFiles(full));
    } else if (stat.isFile()) {
      const ext = entry.slice(entry.lastIndexOf("."));
      if (CHECK_EXTENSIONS.has(ext)) {
        results.push(full);
      }
    }
  }
  return results;
}

const files = collectFiles(ROOT);
const invalid = [];

for (const file of files) {
  const buf = readFileSync(file);
  try {
    // Use TextDecoder with fatal:true — throws on any invalid UTF-8 byte
    new TextDecoder("utf-8", { fatal: true }).decode(buf);
  } catch {
    invalid.push(relative(ROOT, file));
  }
}

if (invalid.length > 0) {
  console.error("❌  Invalid UTF-8 detected in the following file(s):\n");
  for (const f of invalid) {
    console.error(`    ${f}`);
  }
  console.error(
    "\nPlease re-save these files as UTF-8 (without BOM) before committing.",
  );
  process.exit(1);
} else {
  console.log(`✅  All ${files.length} source file(s) are valid UTF-8.`);
}
