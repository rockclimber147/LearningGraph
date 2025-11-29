import { useState } from "react";

type AddNodeRowProps = {
  parentPath: string;
  onAdd: (parentPath: string, name: string, type: "file" | "folder") => void;
};

export default function AddNodeRow({ parentPath, onAdd }: AddNodeRowProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState<"file" | "folder">("file");

  const handleSubmit = () => {
    if (!name) return;
    onAdd(parentPath, name, type);
    setName("");
  };

  return (
    <div className="ml-4 mt-1 flex gap-1">
      <input
        className="px-1"
        type="text"
        placeholder={`New ${type}`}
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <select
        className="px-1"
        value={type}
        onChange={(e) => setType(e.target.value as "file" | "folder")}
      >
        <option value="file">File</option>
        <option value="folder">Folder</option>
      </select>
      <button
        className="bg-[#202020] px-1"
        onClick={handleSubmit}
      >
        Add
      </button>
    </div>
  );
}
