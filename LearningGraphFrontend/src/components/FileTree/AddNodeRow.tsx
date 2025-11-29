import { useState, useEffect, useRef } from "react";

type AddNodeRowProps = {
  parentPath: string;
  defaultType: "file" | "folder";
  onAdd: (parentPath: string, name: string, type: "file" | "folder") => void;
  onClose: () => void;
};

export default function AddNodeRow({
  parentPath,
  defaultType,
  onAdd,
  onClose,
}: AddNodeRowProps) {
  const [name, setName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus the input when the row is rendered
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = () => {
    if (!name) return;
    onAdd(parentPath, name, defaultType);
    setName("");
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit();
    if (e.key === "Escape") onClose();
  };

  return (
    <div className="ml-4 mt-1 flex items-center gap-1">
      <input
        ref={inputRef}
        className="px-1 border rounded"
        type="text"
        placeholder={`New ${defaultType}`}
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button
        className="bg-[#202020] px-2 rounded"
        onClick={handleSubmit}
      >
        Add
      </button>
      <button
        className="text-red-500 font-bold px-2 rounded"
        onClick={onClose}
      >
        ×
      </button>
    </div>
  );
}
