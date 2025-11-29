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

  const handleDownload = () => {
    const blob = new Blob([markdownContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "note.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div style={{ border: "1px solid #ccc", borderRadius: 8, padding: 10, minHeight: 400 }}>
        <BlockNoteView editor={editor} />
      </div>
      <button onClick={handleDownload} style={{ marginTop: 10 }}>
        Download Markdown
      </button>
    </div>
  );
}
