import { useEffect, useState } from "react";
import { useCreateBlockNote, useEditorChange } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";

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
        <h2 className="mb-2 text-lg font-semibold">Editing: {filePath}</h2>

        <div className="border border-gray-300 rounded-lg p-3 min-h-[400px] mb-2">
        <BlockNoteView editor={editor} />
        </div>

        <button
        onClick={handleSave}
        className="mt-2 px-3 py-1 bg-[#202020] text-white rounded"
        >
        Save to Server
        </button>
    </div>
    );

}
