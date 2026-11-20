// Leonida Trophy Tracker — entry program for make.fun gta6-trophy-guide-01.
// Copies app/ and screenshots/ from this repository to the output
// directory and writes /output/dossier.json with buildDossier from the
// kit's vendor/makefun-frontend.ts (unchanged). Outside the grader,
// MAKEFUN_OUTPUT_DIR stands in for /output and MAKEFUN_BOT_DIR for the
// repository root.

import { cpSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const botDir = resolve(process.env.MAKEFUN_BOT_DIR || ".");
const outDir = resolve(process.env.MAKEFUN_OUTPUT_DIR || "/output");

const caps = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 50331648,
  app_path_max_bytes: 1000,
};

function copyTree(name: string): void {
  const src = join(botDir, name);
  const dst = join(outDir, name);
  cpSync(src, dst, { recursive: true });
}

mkdirSync(outDir, { recursive: true });
if (!existsSync(join(botDir, "app", "index.html"))) {
  throw new Error("app/index.html not found under " + botDir);
}
copyTree("app");
copyTree("screenshots");

const dossier = buildDossier(outDir, caps);
writeFileSync(join(outDir, "dossier.json"), dossier);
console.log("wrote " + join(outDir, "dossier.json") + " (" + dossier.length + " bytes)");
