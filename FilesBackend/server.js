import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = 5001;
// Recreate __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOCS_DIR = path.join(__dirname, "docs");

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Ensure docs directory exists
if (!fs.existsSync(DOCS_DIR)) {
  fs.mkdirSync(DOCS_DIR);
}

function getFileTree(dir) {
  const stats = fs.statSync(dir);
  if (stats.isFile()) return { name: path.basename(dir), type: "file" };

  const children = fs.readdirSync(dir).map((child) =>
    getFileTree(path.join(dir, child))
  );
  return { name: path.basename(dir), type: "folder", children };
}

// Utility: validate path is inside DOCS_DIR
function isValidMarkdownFile(filename) {
  const resolved = path.resolve(DOCS_DIR, filename);
  return resolved.startsWith(DOCS_DIR) && resolved.endsWith(".md");
}

// Save Markdown file
app.post("/save", (req, res) => {
  const { filename, content } = req.body;
  if (!filename || !content)
    return res.status(400).send("Missing filename or content");

  if (!isValidMarkdownFile(filename))
    return res.status(400).send("Invalid file. Only Markdown files in docs/ allowed.");

  const filePath = path.join(DOCS_DIR, filename);
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });

  fs.writeFile(filePath, content, "utf8", (err) => {
    if (err) return res.status(500).send(err.message);
    res.send({ message: "File saved successfully" });
  });
});

// Load Markdown file
app.get("/load", (req, res) => {
  const filename = req.query.filename;
  console.log(filename)
  if (!filename) return res.status(400).send({ error: "Missing filename" });

  if (!isValidMarkdownFile(filename))
    return res.status(400).send({ error: "Invalid file. Only Markdown files in docs/ allowed." });

  const filePath = path.join(DOCS_DIR, filename);
  console.log("filepath: " + filePath)
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) return res.status(404).send({ error: "File not found" });
    res.json({ content: data });
  });
});

// Get file tree
app.get("/tree", (req, res) => {
  try {
    const tree = getFileTree(DOCS_DIR);
    // return only children of root
    console.log(tree.children)
    res.json(tree.children);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

app.post("/add", (req, res) => {
  const { parentPath, name, type } = req.body;

  if (!name || !type)
    return res.status(400).send({ error: "Missing name or type" });

  // Compute full path inside DOCS_DIR
  const targetPath = path.join(DOCS_DIR, parentPath || "", name);
  const resolved = path.resolve(targetPath);

  // Ensure path is inside DOCS_DIR
  if (!resolved.startsWith(DOCS_DIR))
    return res.status(400).send({ error: "Invalid path" });

  try {
    if (type === "folder") {
      fs.mkdirSync(resolved, { recursive: true });
      return res.send({ message: "Folder created successfully" });
    } else if (type === "file") {
      // For files, ensure .md extension
      const filePath = resolved.endsWith(".md") ? resolved : resolved + ".md";
      const dir = path.dirname(filePath);
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(filePath, "", "utf8"); // empty file
      return res.send({ message: "File created successfully" });
    } else {
      return res.status(400).send({ error: "Type must be 'file' or 'folder'" });
    }
  } catch (err) {
    return res.status(500).send({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`FilesBackend server running at http://localhost:${PORT}`);
});

app.post("/delete", (req, res) => {
  const { path: targetPath, type } = req.body;
  if (!targetPath || !type) return res.status(400).send({ error: "Missing path or type" });

  const resolved = path.resolve(DOCS_DIR, targetPath);
  if (!resolved.startsWith(DOCS_DIR)) return res.status(400).send({ error: "Invalid path" });

  try {
    if (type === "file") {
      fs.unlinkSync(resolved);
    } else if (type === "folder") {
      fs.rmSync(resolved, { recursive: true, force: true });
    }
    res.send({ message: `${type} deleted successfully` });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});
