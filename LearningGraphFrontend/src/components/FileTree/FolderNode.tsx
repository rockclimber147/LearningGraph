import { useState } from "react";
import { type FileNode } from "./FileTree";
import FileNodeComponent from "./FileNode";
import AddNodeRow from "./AddNodeRow";

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
  const [adding, setAdding] = useState(false);

  const fullPath = node.path || (parentPath ? `${parentPath}/${node.name}` : node.name);

  return (
    <span>
      <div className="flex items-center gap-1">
        <strong>{node.name}</strong>

        <button
          className="font-bold border-none bg-none cursor-pointer"
          onClick={() => setAdding(!adding)}
        >
          {adding ? "-" : "+"}
        </button>

        <button
          onClick={() => onDelete(fullPath, "folder")}
          className="text-red-500 bg-none border-none cursor-pointer"
        >
          🗑
        </button>
      </div>

      {adding && <AddNodeRow parentPath={fullPath} onAdd={onAdd} />}

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
