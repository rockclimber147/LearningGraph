import { useState } from "react";
import MarkdownEditor from "../components/MarkdownEditor";
import FileTree from "../components/FileTree";
import { useNavigate } from "react-router-dom";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";

export default function MarkdownPage() {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  return (
    <div style={{ padding: 20 }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: 20 }}>
        Back
      </button>
      <h1>Markdown Editor</h1>

      <div style={{ display: "flex", marginTop: 20, height: "80vh" }}>
        {/* FileTree sidebar */}
        <div
          style={{
            width: 250,
            borderRight: "1px solid #ccc",
            padding: 10,
            overflowY: "auto",
          }}
        >
          <FileTree onSelectFile={(filePath) => setSelectedFile(filePath)} />
        </div>

        {/* MarkdownEditor */}
        <div style={{ flex: 1, padding: 10 }}>
          {selectedFile ? (
            <MarkdownEditor filePath={selectedFile} />
          ) : (
            <p>Select a file from the tree to edit</p>
          )}
        </div>
      </div>
    </div>
  );
}
