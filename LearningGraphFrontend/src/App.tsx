import { Routes, Route, Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import LoginPage from "./pages/LoginPage";
import LandingPage from "./pages/LandingPage";
import MarkdownPage from "./pages/MarkdownPage";
import { useAuth } from "./hooks/auth";


function ProtectedRoute({ children }: { children: ReactNode }) {
  const { username } = useAuth();
  return username ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      {/* Landing page */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <LandingPage />
          </ProtectedRoute>
        }
      />

      {/* Markdown editor page */}
      <Route
        path="/markdown"
        element={
          <ProtectedRoute>
            <MarkdownPage />
          </ProtectedRoute>
        }
      />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
