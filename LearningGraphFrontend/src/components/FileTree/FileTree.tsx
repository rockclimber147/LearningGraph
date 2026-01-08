import { useEffect, useState, useMemo } from "react";

import FileNodeComponent from "./FileNode";
import FolderNodeComponent from "./FolderNode";
import Toast from "../ToastComponent";
import { FilesApiService } from "../../services/filesApiService";
import type { FileNode } from "../../models/DTO/FileTree";
import type { ApiResponse } from "../../models/DTO/ApiResponse";

type FileTreeProps = {
  onSelectFile: (filePath: string) => void;
};

export default function FileTree({ onSelectFile }: FileTreeProps) {
  const [rootNode, setNodes] = useState<FileNode | null>(null);
  const filesApiService = useMemo(() => new FilesApiService(), []);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const showToast = (
    response: ApiResponse
  ) => {
    if (response) setToast({ message: response.message, type: response.success ? "success" : "error" });
  };

  const fetchTreeAsync = async () => {
    try {
      const data = await filesApiService.fetchTree();
      setNodes(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchTree = async () => {
      try {
        const data = await filesApiService.fetchTree();
        if (isMounted) setNodes(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTree();

    return () => {
      isMounted = false;
    };
  }, [filesApiService]);

  const handleAdd = async (
    parentPath: string,
    name: string,
    type: "file" | "folder"
  ) => {
    try {
      const response = await filesApiService.add({ parentPath, name, type });
      await fetchTreeAsync();
      showToast(response);
    } catch (err) {
      alert("Error adding: " + err);
    }
  };

  const handleDelete = async (fullPath: string, type: "file" | "folder") => {
    if (!window.confirm(`Are you sure you want to delete ${fullPath}?`)) return;
    try {
      const response = await filesApiService.delete({ path: fullPath, type });
      await fetchTreeAsync();
      showToast(response);
    } catch (err) {
      alert("Error deleting: " + err);
    }
  };

  const handleRename = async (fullPath: string, newName: string) => {
    try {
      const response = await filesApiService.rename({ path: fullPath, newName });
      await fetchTreeAsync();
      showToast(response);
    } catch (err) {
      alert("Error renaming: " + err);
    }
  };

  if (!rootNode) return <p>Loading files...</p>;

  return (
    <ul>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      {rootNode.type === "file" ? (
        <FileNodeComponent
          key={rootNode.name}
          name={rootNode.name}
          fullPath={rootNode.path || rootNode.name}
          onSelectFile={onSelectFile}
          onDelete={handleDelete}
          onRename={handleRename}
        />
      ) : (
        <FolderNodeComponent
          key={rootNode.name}
          node={rootNode}
          onSelectFile={onSelectFile}
          onDelete={handleDelete}
          onAdd={handleAdd}
          onRename={handleRename}
        />
      )}
    </ul>
  );
}
