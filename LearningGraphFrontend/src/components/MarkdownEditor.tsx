import { useEffect, useState } from "react";
import { useCreateBlockNote, useEditorChange } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";

type MarkdownEditorProps = {
  filePath: string;
};

export default function MarkdownEditor({ filePath }: MarkdownEditorProps) {
  const editor = useCreateBlockNote();
  const [markdownContent, setMarkdownContent] = useState("");

  // Track changes
  useEditorChange(async (editorInstance) => {
    const md = await editorInstance.blocksToMarkdownLossy(editorInstance.document);
    setMarkdownContent(md);
  }, editor);

  // Load content when filePath changes
  useEffect(() => {
    if (!filePath) return;
    const handleLoad = async () => {
      try {
        const res = await fetch(
          `http://localhost:5001/load?filename=${encodeURIComponent(filePath)}`
        );
        if (!res.ok) throw new Error("File not found");

        const data = await res.json();
        const blocks = editor.tryParseMarkdownToBlocks(data.content);
        editor.replaceBlocks(editor.document, blocks);
      } catch (err) {
        console.error(err);
        alert("Error loading file: " + err);
      }
    };

    handleLoad();
  }, [filePath, editor]);

  // Save current file
  const handleSave = async () => {
    if (!filePath) return;
    try {
      await fetch("http://localhost:5001/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: filePath, content: markdownContent }),
      });
      alert("Saved successfully!");
    } catch (err) {
      alert("Error saving file: " + err);
    }
  };

  return (
    <div>
    <h2>Editing: {filePath}</h2>
      <div style={{ border: "1px solid #ccc", borderRadius: 8, padding: 10, minHeight: 400 }}>
        <BlockNoteView editor={editor} />
      </div>
      <button onClick={handleSave} style={{ marginTop: 10 }}>
        Save to Server
      </button>
    </div>
  );
}
