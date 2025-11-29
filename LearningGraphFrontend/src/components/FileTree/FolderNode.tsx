import { useState } from "react";
import { type FileNode } from "./FileTree";
import FileNodeComponent from "./FileNode"

type FolderNodeProps = {
  node: FileNode;
  parentPath?: string;
  onSelectFile: (filePath: string) => void;
  onDelete: (fullPath: string, type: "file" | "folder") => void;
  onAdd: (parentPath: string, name: string, type: "file" | "folder") => void;
};

export default function FolderNodeComponent({
  node,
  parentPath = "",
  onSelectFile,
  onDelete,
  onAdd,
}: FolderNodeProps) {
  const [addingTo, setAddingTo] = useState(false);
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState<"file" | "folder">("file");

  const fullPath = node.path || (parentPath ? `${parentPath}/${node.name}` : node.name);

  return (
    <span>
      <div className="flex items-center gap-1">
        <strong>{node.name}</strong>

        <button
          className="font-bold border-none bg-none cursor-pointer"
          onClick={() => setAddingTo(!addingTo)}
        >
          {addingTo ? "-" : "+"}
        </button>

        <button
          onClick={() => onDelete(fullPath, "folder")}
          className="text-red-500 bg-none border-none cursor-pointer"
        >
          🗑
        </button>
      </div>

      {addingTo && (
        <div className="ml-4 mt-1 flex gap-1">
          <input
            className="px-1"
            type="text"
            placeholder={`New ${newType}`}
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <select
            className="px-1"
            value={newType}
            onChange={(e) => setNewType(e.target.value as "file" | "folder")}
          >
            <option value="file">File</option>
            <option value="folder">Folder</option>
          </select>
          <button
            className="bg-[#202020] px-1"
            onClick={() => {
              onAdd(fullPath, newName, newType);
              setNewName("");
              setAddingTo(false);
            }}
          >
            Add
          </button>
        </div>
      )}

      <ul className="ml-4">
        {node.children?.map((child) =>
          child.type === "file" ? (
            <FileNodeComponent
              key={child.name}
              name={child.name}
              fullPath={child.path || `${fullPath}/${child.name}`}
              onSelectFile={onSelectFile}
              onDelete={onDelete}
            />
          ) : (
            <FolderNodeComponent
              key={child.name}
              node={child}
              parentPath={fullPath}
              onSelectFile={onSelectFile}
              onDelete={onDelete}
              onAdd={onAdd}
            />
          )
        )}
      </ul>
    </span>
  );
}
