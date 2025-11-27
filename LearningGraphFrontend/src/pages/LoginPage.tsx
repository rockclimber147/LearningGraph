import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/auth";

export default function LoginPage() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = () => {
    const ok = login(user, pass);
    if (!ok) {
      setError("Invalid username or password");
      return;
    }
    navigate("/");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Login</h2>

      <input
        placeholder="Username"
        value={user}
        onChange={(e) => setUser(e.target.value)}
        style={{ display: "block", marginBottom: 10 }}
      />

      <input
        type="password"
        placeholder="Password"
        value={pass}
        onChange={(e) => setPass(e.target.value)}
        style={{ display: "block", marginBottom: 10 }}
      />

      <button onClick={handleLogin}>Login</button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
