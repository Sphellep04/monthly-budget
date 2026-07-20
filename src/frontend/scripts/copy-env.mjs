import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const source = resolve(__dirname, "../env.json");
const target = resolve(__dirname, "../dist/env.json");

mkdirSync(dirname(target), { recursive: true });
copyFileSync(source, target);
