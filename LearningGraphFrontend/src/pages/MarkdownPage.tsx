import MarkdownEditor from "../components/MarkdownEditor";
import { useNavigate } from "react-router-dom";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";

export default function MarkdownPage() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 20 }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: 20 }}>
        Back
      </button>
      <h1>Markdown Editor</h1>
      <MarkdownEditor />
    </div>
  );
}
