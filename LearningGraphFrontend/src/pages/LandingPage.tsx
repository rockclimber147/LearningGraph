import { useAuth } from "../hooks/auth";
import GraphCanvas from "../components/GraphCanvas";
import MarkdownEditor from "../components/MarkdownEditor";

export default function LandingPage() {
  const { username, logout } = useAuth();

  return (
    <div>
      <div style={{ padding: 20 }}>
        <div className="centered-button">
          <h1>Welcome, {username}!</h1>
        </div>

        <div className="centered-button" style={{ marginBottom: 20 }}>
          {/* Render the reusable canvas */}
          <GraphCanvas width={800} height={600} />
        </div>
          {/* Render the Markdown editor */}
          <MarkdownEditor />

        <div className="centered-button">
          <button onClick={logout}>Logout</button>
        </div>
      </div>
    </div>
  );
}
