import { useEffect, useState, useCallback, useMemo } from "react";
import { useCreateBlockNote, useEditorChange } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import { FilesApiService } from "../services/filesAPIService";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";

type MarkdownEditorProps = {
  filePath: string;
};

export default function MarkdownEditor({ filePath }: MarkdownEditorProps) {
  const editor = useCreateBlockNote();
  const [markdownContent, setMarkdownContent] = useState("");
  const apiService = useMemo(() => new FilesApiService(), []);

  // Track editor changes
  useEditorChange(async (editorInstance) => {
    const md = await editorInstance.blocksToMarkdownLossy(editorInstance.document);
    setMarkdownContent(md);
  }, editor);

  // Load file content
  const handleLoad = useCallback(async (path: string) => {
    if (!path) return;
    try {
      const content = await apiService.load(path);
      const blocks = editor.tryParseMarkdownToBlocks(content);
      editor.replaceBlocks(editor.document, blocks);
    } catch (err) {
      console.error(err);
      alert("Error loading file: " + err);
    }
  }, [editor, apiService]);

  // Save file content
  const handleSave = useCallback(async () => {
    if (!filePath) return;
    try {
      await apiService.save(filePath, markdownContent);
      alert("Saved successfully!");
    } catch (err) {
      alert("Error saving file: " + err);
    }
  }, [filePath, markdownContent, apiService]);

  // Effect just triggers load when filePath changes
  useEffect(() => {
    handleLoad(filePath);
  }, [filePath, handleLoad]);

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