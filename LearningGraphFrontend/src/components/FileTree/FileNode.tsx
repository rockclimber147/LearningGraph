import { useState, useRef, useEffect } from "react";
import ContextMenu from "./ContextMenu";

type FileNodeProps = {
  name: string;
  fullPath: string;
  onSelectFile: (filePath: string) => void;
  onDelete: (fullPath: string, type: "file" | "folder") => void;
  onRename?: (fullPath: string, newName: string) => void; // pass newName
};

export default function FileNodeComponent({
  name,
  fullPath,
  onSelectFile,
  onDelete,
  onRename,
}: FileNodeProps) {
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    options: { label: string; onClick: () => void }[];
  } | null>(null);

                const [renaming, setRenaming] = useState(false);
                const [newName, setNewName] = useState(name);
                const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when entering rename mode
  useEffect(() => {
    if (renaming) inputRef.current?.focus();
  }, [renaming]);

  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      options: [
        { label: "Rename", onClick: () => { setRenaming(true); setContextMenu(null); } },
        { label: "Delete", onClick: () => onDelete(fullPath, "file") },
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
      setNewName(name); // reset to original
    }
  };

  return (
    <span className="relative flex items-center gap-1" onContextMenu={handleRightClick}>
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
        <button
          className="bg-[#202020] px-1 mb-1"
          onClick={() => onSelectFile(fullPath)}
        >
          {name}
        </button>
      )}

      {contextMenu && !renaming && (
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
