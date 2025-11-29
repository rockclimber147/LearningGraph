import { useEffect, useState } from "react";

import FileNodeComponent from "./FileNode";
import FolderNodeComponent from "./FolderNode";
import Toast from "../ToastComponent";
import { FilesApiService } from "../../services/filesAPIService";

export type FileNode = {
  name: string;
  type: "file" | "folder";
  path?: string;
  children?: FileNode[];
};

type FileTreeProps = {
  onSelectFile: (filePath: string) => void;
};

export default function FileTree({ onSelectFile }: FileTreeProps) {
  const [nodes, setNodes] = useState<FileNode[] | null>(null);
  const apiService = new FilesApiService();
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const showToast = (message: string, type: "success" | "error" = "success") => {
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
        const res = await fetch("http://localhost:5001/tree");
        const data: FileNode[] = await res.json();
        if (isMounted) setNodes(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTree();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleAdd = async (parentPath: string, name: string, type: "file" | "folder") => {
    try {
      await apiService.add(parentPath, name, type);
      await fetchTreeAsync();
      showToast("added successfully!", "success");
    } catch (err) {
      alert("Error adding file/folder: " + err);
    }
  };

  const handleDelete = async (fullPath: string, type: "file" | "folder") => {
    if (!window.confirm(`Are you sure you want to delete ${fullPath}?`)) return;
    try {
      await apiService.delete(fullPath, type);
      await fetchTreeAsync();
      showToast("deleted successfully!", "success");
    } catch (err) {
      alert("Error deleting file/folder: " + err);
    }
  };

  const handleRename = async (fullPath: string, newName: string) => {
    try {
      await apiService.rename(fullPath, newName);
      await fetchTreeAsync();
      showToast("renamed successfully!", "success");
    } catch (err) {
      alert("Error renaming file/folder: " + err);
    }
  };

  if (!nodes) return <p>Loading files...</p>;

  return (
    <ul>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      {nodes.map((node) =>
        node.type === "file" ? (
          <FileNodeComponent
            key={node.name}
            name={node.name}
            fullPath={node.path || node.name}
            onSelectFile={onSelectFile}
            onDelete={handleDelete}
            onRename={handleRename}
          />
        ) : (
          <FolderNodeComponent
            key={node.name}
            node={node}
            onSelectFile={onSelectFile}
            onDelete={handleDelete}
            onAdd={handleAdd}
            onRename={handleRename}
          />
        )
      )}
    </ul>
  );
}
