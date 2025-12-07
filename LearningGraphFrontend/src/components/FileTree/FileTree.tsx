import { useEffect, useState, useMemo } from "react";

import FileNodeComponent from "./FileNode";
import FolderNodeComponent from "./FolderNode";
import Toast from "../ToastComponent";
import { FilesApiService } from "../../services/filesApiService";
import { MarkdownMetaData } from "../../models/markdown";

export type FileNode = {
  name: string;
  type: "file" | "folder";
  path?: string;
  children?: FileNode[];
  metadata?: MarkdownMetaData;
};

type FileTreeProps = {
  onSelectFile: (filePath: string) => void;
};

export default function FileTree({ onSelectFile }: FileTreeProps) {
  const [rootNode, setNodes] = useState<FileNode | null>(null);
  const apiService = useMemo(() => new FilesApiService(), []);
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

  const fetchTreeAsync = async () => {
    try {
      const data = await apiService.fetchTree();
      setNodes(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchTree = async () => {
      try {
        const data = await apiService.fetchTree();
        if (isMounted) setNodes(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTree();

    return () => {
      isMounted = false;
    };
  }, [apiService]);

  const handleAdd = async (
    parentPath: string,
    name: string,
    type: "file" | "folder"
  ) => {
    try {
      await apiService.add(parentPath, name, type);
      await fetchTreeAsync();
      showToast("added successfully!", "success");
    } catch (err) {
      alert("Error adding: " + err);
    }
  };

  const handleDelete = async (fullPath: string, type: "file" | "folder") => {
    if (!window.confirm(`Are you sure you want to delete ${fullPath}?`)) return;
    try {
      await apiService.delete(fullPath, type);
      await fetchTreeAsync();
      showToast("deleted successfully!", "success");
    } catch (err) {
      alert("Error deleting: " + err);
    }
  };

  const handleRename = async (fullPath: string, newName: string) => {
    try {
      await apiService.rename(fullPath, newName);
      await fetchTreeAsync();
      showToast("renamed successfully!", "success");
    } catch (err) {
      alert("Error renaming: " + err);
    }
  };

  if (!rootNode) return <p>Loading files...</p>;

  return (
    <ul>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      {
        rootNode.type === "file" ? (
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
        )
      }
    </ul>
  );
}
