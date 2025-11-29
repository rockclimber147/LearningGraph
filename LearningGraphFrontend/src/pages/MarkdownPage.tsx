import { useState } from "react";
import MarkdownEditor from "../components/MarkdownEditor";
import FileTree from "../components/FileTree/FileTree";
import { useNavigate } from "react-router-dom";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";

export default function MarkdownPage() {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

    return (
    <div className="p-5">
        {/* Back Button */}
        <button
        onClick={() => navigate(-1)}
        className="mb-5 px-4 py-2 bg-[#202020] text-white rounded"
        >
        Back
        </button>

        <h1 className="text-2xl font-semibold mb-4">Markdown Editor</h1>

        <div className="flex mt-5 h-[80vh]">
        {/* FileTree Sidebar */}
        <div className="w-[250px] border-r border-gray-300 p-3 overflow-y-auto">
            <FileTree onSelectFile={(filePath) => setSelectedFile(filePath)} />
        </div>

        {/* Markdown Editor */}
        <div className="flex-1 p-3">
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
