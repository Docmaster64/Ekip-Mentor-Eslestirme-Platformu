import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Profile from "./pages/Profile";
import Inbox from "./pages/Inbox";

export default function App() {
  return (
    <div>
      <nav style={{ padding: 12, borderBottom: "1px solid #ccc" }}>
        <Link to="/" style={{ marginRight: 12 }}>Ana Sayfa</Link>
        <Link to="/projects" style={{ marginRight: 12 }}>Projeler</Link>
        <Link to="/inbox" style={{ marginRight: 12 }}>Gelen İstekler</Link>
        <Link to="/profile" style={{ marginRight: 12 }}>Profil</Link>
        <Link to="/login" style={{ marginRight: 12 }}>Giriş</Link>
        <Link to="/register">Kayıt</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/inbox" element={<Inbox />} />
      </Routes>
    </div>
  );
}
