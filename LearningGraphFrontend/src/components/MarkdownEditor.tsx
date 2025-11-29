import { useEffect, useState } from "react";
import { useCreateBlockNote, useEditorChange } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";

export default function MarkdownEditor() {
  const editor = useCreateBlockNote();
  const [markdownContent, setMarkdownContent] = useState("");

  // Track changes
  useEditorChange(async (editorInstance) => {
    const md = await editorInstance.blocksToMarkdownLossy(editorInstance.document);
    setMarkdownContent(md);
    localStorage.setItem("myMarkdownNote", md);
  }, editor);

  // Load saved content
    useEffect(() => {
    const saved = localStorage.getItem("myMarkdownNote");
    if (saved) {
        const blocks = editor.tryParseMarkdownToBlocks(saved);
        editor.replaceBlocks(editor.document, blocks);
    }
    }, [editor]);

    const handleSave = async () => {
        try {
        await fetch("http://localhost:5001/save", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ filename: "note.md", content: markdownContent }),
        });
        alert("Saved successfully!");
        } catch (err) {
        alert("Error saving file: " + err);
        }
    };

    const handleLoad = async () => {
        const res = await fetch("http://localhost:5001/load/note.md");
        if (!res.ok) return alert("File not found");
        const data = await res.json();
        const blocks = editor.tryParseMarkdownToBlocks(data.content);
        editor.replaceBlocks(editor.document, blocks);
    };

  return (
    <div>
      <div style={{ border: "1px solid #ccc", borderRadius: 8, padding: 10, minHeight: 400 }}>
        <BlockNoteView editor={editor} />
      </div>
      <div style={{ marginTop: 10 }}>
    <button onClick={handleSave} style={{ marginRight: 10 }}>
        Save to Server
    </button>
    <button onClick={handleLoad}>
        Load from Server
    </button>
    </div>
    </div>
  );
}
