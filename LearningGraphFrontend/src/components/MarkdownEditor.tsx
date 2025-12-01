import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { useCreateBlockNote, useEditorChange } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import Toast from "./ToastComponent";
import { FilesApiService } from "../services/filesApiService";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { DefaultMetaData, MarkdownMetaData, MarkdownFile } from "../models/markdown";
import MarkdownMetaDataComponent from "./MarkDownMetaData";

type MarkdownEditorProps = {
  filePath: string;
};

export default function MarkdownEditor({ filePath }: MarkdownEditorProps) {
  const editor = useCreateBlockNote();
  const [markdownContent, setMarkdownContent] = useState("");
  const [metaData, setMetaData] = useState<MarkdownMetaData>(
    new DefaultMetaData()
  );
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const showToast = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    setToast({ message, type });
  };
  const apiService = useMemo(() => new FilesApiService(), []);

  // Track editor changes
  useEditorChange(async (editorInstance) => {
    const md = editorInstance.blocksToMarkdownLossy(editorInstance.document);
    setMarkdownContent(md);
  }, editor);

  // Load file content
  const handleLoad = useCallback(
    async (path: string) => {
      if (!path) return;
      try {
        const response = await apiService.load(path);
        const markdownFile = new MarkdownFile({
          fileName: response.fileName,
          content: response.content,
          metadata:response.metadata,
        });

        setMetaData(markdownFile.metadata)

        const blocks = editor.tryParseMarkdownToBlocks(markdownFile.content);
        editor.replaceBlocks(editor.document, blocks);
      } catch (err) {
        console.error(err);
        showToast("Error loading file: " + err, "error");
      }
    },
    [editor, apiService]
  );

  const contentRef = useRef(markdownContent);
  useEffect(() => {
    contentRef.current = markdownContent;
  }, [markdownContent]);

  // Save file content
  const handleSave = useCallback(async () => {
    if (!filePath || !contentRef.current) return;
    try {
      await apiService.save(
        filePath,
        contentRef.current,
        metaData
      );
      showToast("Saved successfully!", "success");
    } catch (err) {
      showToast("Error saving file: " + err, "error");
    }
  }, [filePath, apiService, metaData]);

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
    <div className="p-4 md:p-8 min-h-screen">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <h2 className="text-2xl font-extrabold mb-4 border-b pb-2">
        {metaData.title || "Untitled Topic"}
      </h2>

      {/* The new MetaData Form Component */}
      <MarkdownMetaDataComponent
        metadata={metaData}
        onMetaDataChange={setMetaData}
      />

      {/* Markdown Editor View */}
      <div className="border border-gray-300 rounded-xl shadow-lg p-3 min-h-[400px] mb-4">
        <BlockNoteView editor={editor} />
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="w-full md:w-auto px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition duration-200 ease-in-out transform hover:scale-[1.01]"
      >
        💾 Save Changes
      </button>
    </div>
  );
}
