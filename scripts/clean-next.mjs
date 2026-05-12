import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

function rmQuiet(p) {
  if (!fs.existsSync(p)) return false;
  try {
    fs.rmSync(p, { recursive: true, force: true });
    return true;
  } catch (err) {
    console.error(`Could not remove: ${p}`);
    console.error(err instanceof Error ? err.message : err);
    return false;
  }
}

const nextDir = path.join(root, ".next");
const webpackCache = path.join(root, "node_modules", ".cache");

let ok = true;
if (fs.existsSync(nextDir)) {
  if (!rmQuiet(nextDir)) ok = false;
  else console.log("Removed .next");
} else {
  console.log("No .next folder (ok)");
}

if (fs.existsSync(webpackCache)) {
  if (rmQuiet(webpackCache)) console.log("Removed node_modules/.cache");
}

if (!ok) {
  console.error("\nStop all `next dev` / `next start` processes, close programs using this folder, then run again or delete .next manually.");
  process.exit(1);
}
