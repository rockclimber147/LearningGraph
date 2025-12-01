import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { useCreateBlockNote, useEditorChange } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import Toast from "./ToastComponent";
import { FilesApiService } from "../services/filesApiService";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import {
  DefaultMetaData,
  MarkdownMetaData,
  MarkdownFile,
} from "../models/markdown";
import MarkdownMetaDataComponent from "./MarkDownMetaData";

type MarkdownEditorProps = {
  filePath: string;
};

const saveCurrentFile = async (
  apiService: FilesApiService,
  path: string,
  content: string,
  metaData: MarkdownMetaData
) => {
  if (!path || !content) return;
  try {
    await apiService.save(path, content, metaData);
    console.log(`Successfully saved: ${path}`);
    return true;
  } catch (err) {
    console.error(`Save error for ${path}:`, err);
    return false;
  }
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

  const currentFileRef = useRef({
    path: filePath,
    content: markdownContent,
    metadata: metaData,
  });

  useEffect(() => {
    currentFileRef.current = {
      path: filePath,
      content: markdownContent,
      metadata: metaData,
    };
  }, [filePath, markdownContent, metaData]);

  useEditorChange(async (editorInstance) => {
    const md = editorInstance.blocksToMarkdownLossy(editorInstance.document);
    setMarkdownContent(md);
  }, editor);

  const handleManualSave = useCallback(async () => {
    const { path, content, metadata } = currentFileRef.current;
    const success = await saveCurrentFile(apiService, path, content, metadata);
    if (success) {
      showToast("Saved successfully!", "success");
    } else {
      showToast("Error saving file.", "error");
    }
  }, [apiService]);

  const prevFilePathRef = useRef(filePath);

  useEffect(() => {
    const loadFile = async (path: string) => {
      if (!path) return;
      try {
        const response = await apiService.load(path);
        const markdownFile = new MarkdownFile({
          fileName: response.fileName,
          content: response.content,
          metadata: response.metadata,
        });

        setMetaData(markdownFile.metadata);
        setMarkdownContent(markdownFile.content);

        const blocks = editor.tryParseMarkdownToBlocks(markdownFile.content);
        editor.replaceBlocks(editor.document, blocks);
      } catch (err) {
        console.error(err);
        showToast("Error loading file: " + err, "error");
        setMetaData(new DefaultMetaData());
        setMarkdownContent("");
        editor.replaceBlocks(
          editor.document,
          editor.tryParseMarkdownToBlocks("")
        );
      }
    };

    const prevPath = prevFilePathRef.current;
    const newPath = filePath;

    if (prevPath && prevPath !== newPath) {
      const { content: prevContent, metadata: prevMetadata } =
        currentFileRef.current;

      console.log(`File switch detected: Saving old file ${prevPath}`);
      saveCurrentFile(apiService, prevPath, prevContent, prevMetadata);
    }

    if (newPath) {
      loadFile(newPath);
    }
    prevFilePathRef.current = newPath;
  }, [filePath, editor, apiService]);

  useEffect(() => {
    return () => {
      const { path, content, metadata } = currentFileRef.current;
      if (path) {
        console.log(`Component unmounting: Final save of ${path}`);
        saveCurrentFile(apiService, path, content, metadata);
      }
    };
  }, [apiService]);

  return (
    <div className="p-4 md:p-8 min-h-screen">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <h2 className="text-2xl font-extrabold text-white mb-4 border-b border-gray-700 pb-2">
        {filePath}
      </h2>

      {/* Use the dark-mode styled component here */}
      <MarkdownMetaDataComponent
        metadata={metaData}
        onMetaDataChange={setMetaData}
      />

      <div className="border border-gray-700 rounded-xl shadow-lg p-3 min-h-[400px] mb-4">
        <BlockNoteView editor={editor} />
      </div>

      <button
        onClick={handleManualSave}
        className="w-full md:w-auto px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition duration-200 ease-in-out transform hover:scale-[1.01]"
      >
        💾 Save Changes
      </button>
    </div>
  );
}
