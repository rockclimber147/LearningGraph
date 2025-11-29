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
  const fullPath =
    node.path || (parentPath ? `${parentPath}/${node.name}` : node.name);

  // Skip non-markdown files
  if (node.type === "file" && !node.name.endsWith(".md")) return null;

  // FILE
  if (node.type === "file") {
    return (
      <span key={fullPath} className="filetree-node">
        <button onClick={() => onSelectFile(fullPath)}>
          {node.name}
        </button>

        <button
          onClick={() => handleDelete(fullPath, "file")}
          className="filetree-delete"
        >
          🗑
        </button>
      </span>
    );
  }

  // FOLDER
  return (
    <span key={fullPath}>
      <div className="filetree-node">
        <strong>{node.name}</strong>

        <button
          onClick={() =>
            setAddingTo(addingTo === fullPath ? null : fullPath)
          }
        >
          {addingTo === fullPath ? "-" : "+"}
        </button>

        <button
          onClick={() => handleDelete(fullPath, "folder")}
          className="filetree-delete"
        >
          🗑
        </button>
      </div>

      {/* Inline add input */}
      {addingTo === fullPath && (
        <div className="add-row">
          <input
            type="text"
            placeholder={`New ${newType}`}
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />

          <select
            value={newType}
            onChange={(e) =>
              setNewType(e.target.value as "file" | "folder")
            }
          >
            <option value="file">File</option>
            <option value="folder">Folder</option>
          </select>

          <button onClick={() => handleAddSubmit(fullPath)}>Add</button>
        </div>
      )}

      {/* Children */}
      <ul className="children-list">
        {node.children?.map((child) => renderNode(child, fullPath))}
      </ul>
    </span>
  );
};


  if (!nodes) return <p>Loading files...</p>;
  return <ul>{nodes.map((node) => renderNode(node))}</ul>;
}
