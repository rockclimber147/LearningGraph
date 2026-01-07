import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/auth";

export default function LoginPage() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      await login(user, pass);
      navigate("/");
    } catch {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="p-5">
      <h2 className="mb-4 text-xl font-semibold">Login</h2>
      <input
        placeholder="Username"
        value={user}
        onChange={(e) => setUser(e.target.value)}
        className="block w-full mb-2 px-3 py-2 border rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={pass}
        onChange={(e) => setPass(e.target.value)}
        className="block w-full mb-2 px-3 py-2 border rounded"
      />
      <button
        onClick={handleLogin}
        className="px-4 py-2 bg-[#202020] text-white rounded"
      >
        Login
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
