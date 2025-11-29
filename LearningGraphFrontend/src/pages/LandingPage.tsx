import { useAuth } from "../hooks/auth";
import GraphCanvas from "../components/GraphCanvas";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const { username, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={{ padding: 20 }}>
      <h1>Welcome, {username}!</h1>

      <div style={{ margin: "20px 0" }}>
        <GraphCanvas width={800} height={600} />
      </div>

      <button
        onClick={() => navigate("/markdown")}
        style={{ display: "block", marginBottom: 20 }}
      >
        Open Markdown Editor
      </button>

      <button onClick={logout}>Logout</button>
    </div>
  );
}
