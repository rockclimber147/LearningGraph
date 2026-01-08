import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/auth";

export default function LoginPage() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const { login, username, isLoading } = useAuth();

  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    if (!isLoading && username) {
      navigate(from, { replace: true });
    }
  }, [isLoading, username, navigate, from]);

  const handleLogin = async () => {
    try {
      setError("");
      await login(user, pass);
      navigate(from, { replace: true });
    } catch {
      setError("Invalid username or password");
    }
  };

  if (isLoading) {
    return <div className="p-5">Checking session...</div>;
  }

  return (
    <div className="p-5 max-w-sm mx-auto mt-10 border rounded-xl shadow-sm">
      <h2 className="mb-4 text-xl font-semibold">Login</h2>
      <input
        placeholder="Username"
        value={user}
        onChange={(e) => setUser(e.target.value)}
        className="block w-full mb-2 px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
      />
      <input
        type="password"
        placeholder="Password"
        value={pass}
        onChange={(e) => setPass(e.target.value)}
        className="block w-full mb-4 px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
      />
      <button
        onClick={handleLogin}
        className="w-full px-4 py-2 bg-[#202020] hover:bg-black text-white rounded transition-colors"
      >
        Login
      </button>
      {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
    </div>
  );
}