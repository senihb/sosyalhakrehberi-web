import { cp, mkdir, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const standaloneDir = join(root, ".next", "standalone");
const standaloneNextDir = join(standaloneDir, ".next");

if (!existsSync(standaloneDir)) {
  process.exit(0);
}

await mkdir(standaloneNextDir, { recursive: true });

const targets = [
  { from: join(root, ".next", "static"), to: join(standaloneNextDir, "static") },
  { from: join(root, "public"), to: join(standaloneDir, "public") },
];

for (const { from, to } of targets) {
  if (!existsSync(from)) continue;
  await rm(to, { recursive: true, force: true });
  await cp(from, to, { recursive: true });
}