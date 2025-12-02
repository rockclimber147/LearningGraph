import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);
export const DOCS_DIR = path.join(__dirname, "docs");

export function getFileTree(dir) {
  const stats = fs.statSync(dir);

  if (stats.isFile()) {
    const fileNode = { name: path.basename(dir), type: "file" };

    if (isMarkdownFile(dir)) {
      // 1. If it's a Markdown file, get its metadata
      fileNode.metadata = getMarkdownMetadata(dir);
    }
    return fileNode;
  }

  // If it's a directory
  const children = fs
    .readdirSync(dir)
    .map((child) => getFileTree(path.join(dir, child)))
    // Optional: Filter out any null/undefined results from recursive calls if error handling was added
    .filter(child => child !== null); 
    
  return { name: path.basename(dir), type: "folder", children };
}

function getMarkdownMetadata(filepath) {
  try {
    const fileContent = fs.readFileSync(filepath, "utf8");
    const result = matter(fileContent);

    // Extract and structure the relevant metadata fields
    return {
      title: result.data.title || "Untitled Topic",
      tags: result.data.tags || [],
      prerequisites: result.data.prerequisites || [],
      related: result.data.related || [],
    };
  } catch (error) {
    console.error(`Error reading or parsing metadata for ${filepath}:`, error);
    // Return a default structure in case of an error
    return {
      title: path.basename(filepath),
      tags: [],
      prerequisites: [],
      related: [],
    };
  }
}

export function isMarkdownFile(filename) {
  const resolved = path.resolve(DOCS_DIR, filename);
  return resolved.startsWith(DOCS_DIR) && resolved.endsWith(".md");
}

export function thingThatReturns1() {
  return 1;
}
