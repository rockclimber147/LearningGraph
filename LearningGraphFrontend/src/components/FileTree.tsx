import { useEffect, useState } from "react";

export type FileNode = {
  name: string;
  type: "file" | "folder";
  path?: string; // optional, full path
  children?: FileNode[];
};

type FileTreeProps = {
  onSelectFile: (filePath: string) => void;
};

export default function FileTree({ onSelectFile }: FileTreeProps) {
  const [nodes, setNodes] = useState<FileNode[] | null>(null);

  useEffect(() => {
    fetch("http://localhost:5001/tree")
      .then((res) => res.json())
      .then((data: FileNode[]) => setNodes(data))
      .catch(console.error);
  }, []);

  const renderNode = (node: FileNode, parentPath = "") => {
    const fullPath = node.path || (parentPath ? `${parentPath}/${node.name}` : node.name);

    // Skip non-markdown files
    if (node.type === "file" && !node.name.endsWith(".md")) return null;

    if (node.type === "file") {
      return (
        <li key={fullPath}>
          <button
            onClick={() => onSelectFile(fullPath)}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
              textAlign: "left",
              color: "#0077ff",
            }}
          >
            {node.name}
          </button>
        </li>
      );
    }

    return (
      <li key={fullPath}>
        <strong>{node.name}</strong>
        <ul style={{ marginLeft: 15 }}>
          {node.children?.map((child) => renderNode(child, fullPath))}
        </ul>
      </li>
    );
  };

  if (!nodes) return <p>Loading files...</p>;
  return <ul>{nodes.map((node) => renderNode(node))}</ul>;
}
