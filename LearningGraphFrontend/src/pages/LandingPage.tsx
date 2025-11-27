import { useAuth } from "../hooks/auth";
import GraphCanvas from "../components/GraphCanvas";

export default function LandingPage() {
  const { username, logout } = useAuth();

  return (
    <div>
      <div style={{ padding: 20 }}>
        <div className="centered-button">
          <h1>Welcome, {username}!</h1>
        </div>
        <div className="centered-button">
          {/* Render the reusable canvas */}
          <GraphCanvas width={800} height={600} />
        </div>
      </div>
      <div className="centered-button">
        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
}
