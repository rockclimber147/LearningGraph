import { useAuth } from "../hooks/auth";
import GraphCanvas from "../components/GraphCanvas";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const { username, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="p-5">
      <h1 className="mb-4 text-2xl font-semibold">Hello, {username}!</h1>

      <div className="my-5">
        <GraphCanvas width={800} height={600} />
      </div>

      <button
        onClick={() => navigate("/markdown")}
        className="block mb-5 px-4 py-2 bg-[#202020] text-white rounded"
      >
        Open Markdown Editor
      </button>

      <button
        onClick={logout}
        className="px-4 py-2 bg-[#202020] text-white rounded"
      >
        Logout
      </button>
    </div>
  );
}
