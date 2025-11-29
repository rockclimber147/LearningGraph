import { useEffect, useState } from "react";
import FileNodeComponent from "./FileNode";
import FolderNodeComponent from "./FolderNode";

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

  const fetchTreeAsync = async () => {
    try {
      const res = await fetch("http://localhost:5001/tree");
      const data: FileNode[] = await res.json();
      setNodes(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    let isMounted = true; // optional flag to avoid setting state if unmounted

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
      await fetch("http://localhost:5001/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ parentPath, name, type }),
      });
      await fetchTreeAsync();
    } catch (err) {
      alert("Error adding file/folder: " + err);
    }
  };

  const handleDelete = async (fullPath: string, type: "file" | "folder") => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;

    try {
      await fetch("http://localhost:5001/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: fullPath, type }),
      });
      await fetchTreeAsync();
    } catch (err) {
      alert("Error deleting file/folder: " + err);
    }
  };

  if (!nodes) return <p>Loading files...</p>;

  return (
    <ul>
      {nodes.map((node) =>
        node.type === "file" ? (
          <FileNodeComponent
            key={node.name}
            name={node.name}
            fullPath={node.path || node.name}
            onSelectFile={onSelectFile}
            onDelete={handleDelete}
          />
        ) : (
          <FolderNodeComponent
            key={node.name}
            node={node}
            onSelectFile={onSelectFile}
            onDelete={handleDelete}
            onAdd={handleAdd}
          />
        )
      )}
    </ul>
  );
}
