import { useAuth } from "../hooks/auth";

export default function LandingPage() {
  const { username, logout } = useAuth();

  return (
    <div style={{ padding: 20 }}>
      <h1>Welcome, {username}!</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
