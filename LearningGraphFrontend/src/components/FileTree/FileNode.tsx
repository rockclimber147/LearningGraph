type FileNodeProps = {
  name: string;
  fullPath: string;
  onSelectFile: (filePath: string) => void;
  onDelete: (fullPath: string, type: "file" | "folder") => void;
};

export default function FileNodeComponent({
  name,
  fullPath,
  onSelectFile,
  onDelete,
}: FileNodeProps) {
  return (
    <span className="flex items-center gap-1">
      <button
        className="bg-[#202020] px-1 mb-1"
        onClick={() => onSelectFile(fullPath)}
      >
        {name}
      </button>

      <button
        onClick={() => onDelete(fullPath, "file")}
        className="text-red-500 bg-none border-none cursor-pointer"
      >
        🗑
      </button>
    </span>
  );
}
