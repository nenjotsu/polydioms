import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/authStore";
import Navbar       from "./components/Navbar";
import Home         from "./pages/Home";
import Login        from "./pages/Login";
import Register     from "./pages/Register";
import Game         from "./pages/Game";
import Leaderboard  from "./pages/Leaderboard";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter basename="/polydioms">   {/* ← matches vite base */}
      <Navbar />
      <Routes>
        <Route path="/"            element={<Home />} />
        <Route path="/login"       element={<Login />} />
        <Route path="/register"    element={<Register />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/game" element={
          <ProtectedRoute><Game /></ProtectedRoute>
        }/>
      </Routes>
    </BrowserRouter>
  );
}