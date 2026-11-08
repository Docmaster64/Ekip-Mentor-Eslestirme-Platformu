import { useEffect, useState } from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Profile from "./pages/Profile";
import Inbox from "./pages/Inbox";
import ProjectCreate from "./pages/ProjectCreate";
import { getToken } from "./api";

type Role = "STUDENT" | "FACULTY" | "ADMIN" | null;

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

  const isAuth = !!role;

  return (
    <div>
      <nav>
        <span className="brand">Ekip & Mentör</span>
        {isAuth ? (
          <>
            <Link to="/projects">Projeler</Link>
            {role !== "ADMIN" && <Link to="/projects/create">Yeni Proje Ekle</Link>}
            <Link to="/inbox">Gelen İstekler</Link>
            <Link to="/profile">Profil</Link>
            <Link to="/login">Çıkış</Link>
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
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/create" element={<ProjectCreate />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/inbox" element={<Inbox />} />
        </Routes>
      </div>
    </div>
  );
}
