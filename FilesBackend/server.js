import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";
import {
  isValidMarkdownFile,
  getFileTree,
  DOCS_DIR,
  __dirname,
  __filename,
} from "./fileUtils.js";
import matter from "gray-matter";

const app = express();
const PORT = 5001;

app.use(cors());
app.use(bodyParser.json());

if (!fs.existsSync(DOCS_DIR)) {
  fs.mkdirSync(DOCS_DIR);
}

app.get("/health", (req, res) => {
  return res.status(200).send("healthy");
});

app.post("/save", (req, res) => {
  const { filename, content, metadata } = req.body;
  if (!filename || !content)
    return res.status(400).send("Missing filename or content");

  if (!isValidMarkdownFile(filename))
    return res
      .status(400)
      .send("Invalid file. Only Markdown files in docs/ allowed.");
  const filePath = path.join(DOCS_DIR, filename);
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });
  
  const fileWithFrontmatter = matter.stringify(content, metadata);
  fs.writeFile(filePath, fileWithFrontmatter, "utf8", (err) => {
    if (err) return res.status(500).send(err.message);
    res.send({ message: "File saved successfully" });
  });
});

app.get("/load", (req, res) => {
  const filename = req.query.filename;
  if (!filename) return res.status(400).send({ error: "Missing filename" });

  if (!isValidMarkdownFile(filename))
    return res
      .status(400)
      .send({ error: "Invalid file. Only Markdown files in docs/ allowed." });

  const filePath = path.join(DOCS_DIR, filename);
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.log("error reading file: " + filePath);
      return res.status(404).send({ error: "File not found" });
    }

    try {
      const result = matter(data);
      const structuredResponse = {
        fileName: filename,
        content: result.content,
        metadata: {
          title: result.data.title || "Untitled Topic",
          tags: result.data.tags || [],
          prerequisites: result.data.prerequisites || [],
          related: result.data.related || [],
        },
      };
      res.json(structuredResponse);
    } catch (parseError) {
      console.error(`Error parsing frontmatter for ${filename}:`, parseError);
      return res.status(500).send({ error: "Failed to parse file content." });
    }
  });
});

app.get("/tree", (req, res) => {
  try {
    const tree = getFileTree(DOCS_DIR);
    // return only children of root
    res.json(tree.children);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

app.post("/add", (req, res) => {
  const { parentPath, name, type } = req.body;

  if (!name || !type)
    return res.status(400).send({ error: "Missing name or type" });

  const targetPath = path.join(DOCS_DIR, parentPath || "", name);
  const resolved = path.resolve(targetPath);

  if (!resolved.startsWith(DOCS_DIR))
    return res.status(400).send({ error: "Invalid path" });

  try {
    if (type === "folder") {
      fs.mkdirSync(resolved, { recursive: true });
      return res.send({ message: "Folder created successfully" });
    } else if (type === "file") {
      const filePath = resolved.endsWith(".md") ? resolved : resolved + ".md";
      const dir = path.dirname(filePath);
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(filePath, "", "utf8");
      return res.send({ message: "File created successfully" });
    } else {
      return res.status(400).send({ error: "Type must be 'file' or 'folder'" });
    }
  } catch (err) {
    return res.status(500).send({ error: err.message });
  }
});

app.post("/delete", (req, res) => {
  const { path: targetPath, type } = req.body;
  if (!targetPath || !type)
    return res.status(400).send({ error: "Missing path or type" });

  const resolved = path.resolve(DOCS_DIR, targetPath);
  if (!resolved.startsWith(DOCS_DIR))
    return res.status(400).send({ error: "Invalid path" });

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

app.post("/rename", (req, res) => {
  const { path: targetPath, newName } = req.body;
  const resolved = path.resolve(DOCS_DIR, targetPath);
  if (!resolved.startsWith(DOCS_DIR))
    return res.status(400).send({ error: "Invalid path" });

  const newPath = path.join(path.dirname(resolved), newName);
  fs.rename(resolved, newPath, (err) => {
    if (err) return res.status(500).send({ error: err.message });
    res.send({ message: "Renamed successfully" });
  });
});

export default app;

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`FilesBackend server running at http://localhost:${PORT}`);
  });
}
