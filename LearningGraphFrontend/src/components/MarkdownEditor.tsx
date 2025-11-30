import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { useCreateBlockNote, useEditorChange } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import Toast  from "./ToastComponent"
import { FilesApiService } from "../services/filesApiService";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";

type MarkdownEditorProps = {
  filePath: string;
};

export default function MarkdownEditor({ filePath }: MarkdownEditorProps) {
  const editor = useCreateBlockNote();
  const [markdownContent, setMarkdownContent] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
  };
  const apiService = useMemo(() => new FilesApiService(), []);

  // Track editor changes
  useEditorChange(async (editorInstance) => {
    const md = editorInstance.blocksToMarkdownLossy(editorInstance.document);
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
      showToast("Error loading file: " + err, "error");
    }
  }, [editor, apiService]);

  const contentRef = useRef(markdownContent);
    useEffect(() => {
    contentRef.current = markdownContent;
  }, [markdownContent]);

  // Save file content
  const handleSave = useCallback(async () => {
    if (!filePath || !contentRef.current) return;
    try {
      await apiService.save(filePath, contentRef.current);
      showToast("Saved successfully!", "success");
    } catch (err) {
      showToast("Error saving file: " + err, "error");
    }
  }, [filePath, apiService]);

  // Effect just triggers load when filePath changes
    useEffect(() => {
    if (!filePath) return;
    const loadFile = async () => {
        await handleLoad(filePath);
    };
    loadFile();
    }, [filePath, handleLoad]);

  useEffect(() => {
    return () => {
        handleSave();
    };
    }, [handleSave]);

  return (
    <div>
        {toast && <Toast {...toast} onClose={() => setToast(null)} />}
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