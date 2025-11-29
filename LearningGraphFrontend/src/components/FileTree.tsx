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
  const [addingTo, setAddingTo] = useState<string | null>(null); 
  const [newName, setNewName] = useState<string>(""); 
  const [newType, setNewType] = useState<"file" | "folder">("file");

  // Move fetchTreeAsync outside the effect
  const fetchTreeAsync = async () => {
    try {
      const res = await fetch("http://localhost:5001/tree");
      const data: FileNode[] = await res.json();
      setNodes(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Call fetchTreeAsync on mount
    useEffect(() => {   
    const fetch = async () => {
        await fetchTreeAsync();
    };
    fetch();
    }, []);

  const handleAddSubmit = async (parentPath: string) => {
    if (!newName) return;

    try {
      await fetch("http://localhost:5001/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ parentPath, name: newName, type: newType }),
      });

      setAddingTo(null);
      setNewName("");
      await fetchTreeAsync(); // now this works
    } catch (err) {
      alert("Error adding file/folder: " + err);
    }
  };

  const handleDelete = async (fullPath: string, type: "file" | "folder") => {
  const confirmed = window.confirm(`Are you sure you want to delete this ${type}?`);
  if (!confirmed) return;

  try {
    await fetch("http://localhost:5001/delete", {
      method: "POST", // or DELETE if you prefer
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: fullPath, type }),
    });

    // Refresh tree after deletion
    await fetchTreeAsync();
  } catch (err) {
    alert("Error deleting file/folder: " + err);
  }
};

  const renderNode = (node: FileNode, parentPath = "") => {
    const fullPath = node.path || (parentPath ? `${parentPath}/${node.name}` : node.name);

    // Skip non-markdown files
    if (node.type === "file" && !node.name.endsWith(".md")) return null;

    // For files
    if (node.type === "file") {
    return (
        <span key={fullPath} style={{ display: "flex", alignItems: "center", gap: 5 }}>
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
        <button
            onClick={() => handleDelete(fullPath, "file")}
            style={{ color: "red", cursor: "pointer", border: "none", background: "none" }}
        >
            🗑
        </button>
        </span>
    );
    }

    // For folders (inside renderNode)
    return (
    <span key={fullPath}>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
        <strong>{node.name}</strong>
        <button
            style={{ cursor: "pointer", border: "none", background: "none", fontWeight: "bold" }}
            onClick={() => setAddingTo(addingTo === fullPath ? null : fullPath)}
        >
            {addingTo === fullPath ? "-" : "+"}
        </button>
        <button
            onClick={() => handleDelete(fullPath, "folder")}
            style={{ color: "red", cursor: "pointer", border: "none", background: "none" }}
        >
            🗑
        </button>
        </div>

        {/* Inline add input */}
        {addingTo === fullPath && (
        <div style={{ marginLeft: 15, marginTop: 2, display: "flex", gap: 5 }}>
            <input
            type="text"
            placeholder={`New ${newType}`}
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            />
            <select value={newType} onChange={(e) => setNewType(e.target.value as "file" | "folder")}>
            <option value="file">File</option>
            <option value="folder">Folder</option>
            </select>
            <button onClick={() => handleAddSubmit(fullPath)}>Add</button>
        </div>
        )}

        {/* Render children */}
        <ul style={{ marginLeft: 15 }}>
        {node.children?.map((child) => renderNode(child, fullPath))}
        </ul>
    </span>
    );

  };

  if (!nodes) return <p>Loading files...</p>;
  return <ul>{nodes.map((node) => renderNode(node))}</ul>;
}
