import { useState, useRef } from "react";
import { type FileNode } from "./FileTree";
import FileNodeComponent from "./FileNode";
import AddNodeRow from "./AddNodeRow";
import ContextMenu from "./ContextMenu";

type FolderNodeProps = {
  node: FileNode;
  parentPath?: string;
  onSelectFile: (filePath: string) => void;
  onDelete: (fullPath: string, type: "file" | "folder") => void;
  onAdd: (parentPath: string, name: string, type: "file" | "folder") => void;
  onRename?: (fullPath: string, newName: string) => void;
};

export default function FolderNodeComponent({
  node,
  parentPath = "",
  onSelectFile,
  onDelete,
  onAdd,
  onRename,
}: FolderNodeProps) {
  const [adding, setAdding] = useState(false);
  const [addingType, setAddingType] = useState<"file" | "folder">("file");
  const [renaming, setRenaming] = useState(false);
  const [newName, setNewName] = useState(node.name);
  const inputRef = useRef<HTMLInputElement>(null);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    options: { label: string; onClick: () => void }[];
  } | null>(null);

  const fullPath = node.path || (parentPath ? `${parentPath}/${node.name}` : node.name);

  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      options: [
        {
          label: "Add File",
          onClick: () => {
            setAddingType("file");
            setAdding(true);
          },
        },
        {
          label: "Add Folder",
          onClick: () => {
            setAddingType("folder");
            setAdding(true);
          },
        },
        { label: "Rename", onClick: () => { setRenaming(true); setContextMenu(null); } },
        { label: "Delete", onClick: () => onDelete(fullPath, "folder") },
      ],
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && newName.trim()) {
      onRename?.(fullPath, newName.trim());
      setRenaming(false);
    }
    if (e.key === "Escape") {
      setRenaming(false);
      setNewName(node.name); // reset to original
    }
  };

  return (
    <span className="relative" onContextMenu={handleRightClick}>
      <div className="flex items-center gap-1">
        {renaming ? (
            <input
            ref={inputRef}
            className="px-1 border rounded"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => setRenaming(false)} // optional: close on blur
            />
        ) : (
            <strong>{node.name}</strong>
        )}
            

        <button
          className="font-bold border-none bg-none cursor-pointer"
          onClick={() => setAdding(!adding)}
        >
          {adding ? "-" : "+"}
        </button>
      </div>

      {/* Inline AddRow */}
      {adding && (
        <AddNodeRow
          parentPath={fullPath}
          defaultType={addingType}
          onAdd={onAdd}
          onClose={() => setAdding(false)}
        />
      )}

      {/* Render children */}
      <ul className="ml-4">
        {node.children?.map((child) =>
          child.type === "file" ? (
            <FileNodeComponent
              key={child.name}
              name={child.name}
              fullPath={child.path || `${fullPath}/${child.name}`}
              onSelectFile={onSelectFile}
              onDelete={onDelete}
              onRename={onRename}
            />
          ) : (
            <FolderNodeComponent
              key={child.name}
              node={child}
              parentPath={fullPath}
              onSelectFile={onSelectFile}
              onDelete={onDelete}
              onAdd={onAdd}
              onRename={onRename}
            />
          )
        )}
      </ul>

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          options={contextMenu.options}
          onClose={() => setContextMenu(null)}
        />
      )}
    </span>
  );
}
