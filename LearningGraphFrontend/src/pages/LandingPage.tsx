import { useAuth } from "../hooks/auth";
import GraphCanvas from "../components/GraphCanvas";

export default function LandingPage() {
  const { username, logout } = useAuth();

  return (
    <div style={{ padding: 20 }}>
      <h1>Welcome, {username}!</h1>
      <button onClick={logout}>Logout</button>

      {/* Render the reusable canvas */}
      <GraphCanvas width={800} height={600} />
    </div>
  );
}
