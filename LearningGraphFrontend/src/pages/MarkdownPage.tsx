import MarkdownEditor from "../components/MarkdownEditor";
import FileTree from "../components/FileTree/FileTree";
import { useNavigate, useParams } from "react-router-dom";

export default function MarkdownPage() {
  const navigate = useNavigate();
  const params = useParams();
  const selectedFile = params["*"];
  const handleFileSelect = (filePath: string) => {
    const encodedPath = filePath
      .split("/")
      .map((segment) => encodeURIComponent(segment))
      .join("/");
    navigate(`/markdown/file/${encodedPath}`);
  };
  return (
    <div className="p-5">
      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        className="mb-5 px-4 py-2 bg-[#202020] text-white rounded"
      >
        Back
      </button>

      <h1 className="text-2xl font-semibold mb-4">Markdown Editor</h1>

      <div className="flex mt-5 h-[80vh]">
        {/* FileTree Sidebar */}
        <div className="w-[250px] border-r border-gray-300 p-3 overflow-y-auto">
          <FileTree onSelectFile={(filePath) => handleFileSelect(filePath)} />
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
