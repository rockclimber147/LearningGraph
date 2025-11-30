import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);
export const DOCS_DIR = path.join(__dirname, "docs");

export function getFileTree(dir) {
  const stats = fs.statSync(dir);
  if (stats.isFile()) return { name: path.basename(dir), type: "file" };

  const children = fs
    .readdirSync(dir)
    .map((child) => getFileTree(path.join(dir, child)));
  return { name: path.basename(dir), type: "folder", children };
}

export function isValidMarkdownFile(filename) {
  const resolved = path.resolve(DOCS_DIR, filename);
  return resolved.startsWith(DOCS_DIR) && resolved.endsWith(".md");
}