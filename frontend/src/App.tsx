import { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Profile from "./pages/Profile";
import Inbox from "./pages/Inbox";
import ProjectCreate from "./pages/ProjectCreate";
import ProtectedRoute from "./components/ProtectedRoute";
import { getToken } from "./api";
import { ToastProvider, useToast } from "./components/Toast";

type Role = "STUDENT" | "FACULTY" | "ADMIN" | null;

function Navbar({ role }: { role: Role }) {
  const isAuth = !!role;
  const { unreadCount, clearUnread } = useToast();

  return (
    <nav>
      <span className="brand">Ekip & Mentör</span>
      {isAuth ? (
        <>
          <Link to="/projects">Projeler</Link>
          {role !== "ADMIN" && <Link to="/projects/create">Yeni Proje Ekle</Link>}
          <Link to="/inbox" onClick={clearUnread}>
            Gelen İstekler
            {unreadCount > 0 && <span className="nav-badge">{unreadCount}</span>}
          </Link>
          <Link to="/profile">Profil</Link>
          <Link to="/login" onClick={() => localStorage.removeItem("token")}>Çıkış</Link>
        </>
      ) : (
        <>
          <Link to="/">Ana Sayfa</Link>
          <Link to="/projects">Projeler</Link>
          <Link to="/login">Giriş</Link>
          <Link to="/register">Kayıt</Link>
        </>
      )}
    </nav>
  );
}

export default function App() {
  const [role, setRole] = useState<Role>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setRole(payload.role as Role);
      } catch {
        setRole(null);
      }
    }
    setReady(true);
  }, []);

  if (!ready) return <div className="card" style={{ maxWidth: 400, margin: "48px auto" }}>Yükleniyor...</div>;

  return (
    <ToastProvider>
      <div>
        <Navbar role={role} />
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/projects" element={<Projects />} />
            <Route
              path="/projects/create"
              element={
                <ProtectedRoute allowedRoles={["STUDENT", "FACULTY"]}>
                  <ProjectCreate />
                </ProtectedRoute>
              }
            />
            <Route path="/projects/:id" element={<ProjectDetail />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/inbox"
              element={
                <ProtectedRoute>
                  <Inbox />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </ToastProvider>
  );
}
