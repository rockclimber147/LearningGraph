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

// Now you can safely use __dirname
const DOCS_DIR = path.join(__dirname, "docs");

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Ensure docs directory exists
if (!fs.existsSync(DOCS_DIR)) {
  fs.mkdirSync(DOCS_DIR);
}

// Save Markdown file
app.post("/save", (req, res) => {
  const { filename, content } = req.body;
  if (!filename || !content) return res.status(400).send("Missing filename or content");

  const filePath = path.join(DOCS_DIR, filename);
  fs.writeFile(filePath, content, "utf8", (err) => {
    if (err) return res.status(500).send(err.message);
    res.send({ message: "File saved successfully" });
  });
});

// Load Markdown file
app.get("/load/:filename", (req, res) => {
  const filePath = path.join(DOCS_DIR, req.params.filename);
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) return res.status(404).send({ error: "File not found" });
    res.send({ content: data });
  });
});

app.listen(PORT, () => {
  console.log(`FilesBackend server running at http://localhost:${PORT}`);
});
