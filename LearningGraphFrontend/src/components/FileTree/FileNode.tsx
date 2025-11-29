import { useState } from "react";
import ContextMenu from "./ContextMenu";

type FileNodeProps = {
  name: string;
  fullPath: string;
  onSelectFile: (filePath: string) => void;
  onDelete: (fullPath: string, type: "file" | "folder") => void;
  onRename?: (fullPath: string) => void;
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

  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      options: [
        { label: "Rename", onClick: () => onRename?.(fullPath) },
        { label: "Delete", onClick: () => onDelete(fullPath, "file") },
      ],
    });
  };

  return (
    <span className="relative flex items-center gap-1" onContextMenu={handleRightClick}>
      <button
        className="bg-[#202020] px-1 mb-1"
        onClick={() => onSelectFile(fullPath)}
      >
        {name}
      </button>

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
