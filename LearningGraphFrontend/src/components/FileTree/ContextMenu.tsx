import { createPortal } from "react-dom";

type ContextMenuProps = {
  x: number;
  y: number;
  options: { label: string; onClick: () => void }[];
  onClose: () => void;
};

export default function ContextMenu({ x, y, options, onClose }: ContextMenuProps) {
  return createPortal(
    <ul
      className="fixed bg-gray-800 text-white rounded shadow-md z-50"
      style={{ top: y, left: x }}
      onMouseLeave={onClose}
    >
      {options.map((opt) => (
        <li
          key={opt.label}
          className="px-4 py-2 cursor-pointer hover:bg-gray-700"
          onClick={() => {
            opt.onClick();
            onClose();
          }}
        >
          {opt.label}
        </li>
      ))}
    </ul>,
    document.body
  );
}
