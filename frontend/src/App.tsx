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
      <nav>
        <span className="brand">Ekip & Mentör</span>
        <Link to="/">Ana Sayfa</Link>
        <Link to="/projects">Projeler</Link>
        <Link to="/inbox">Gelen İstekler</Link>
        <Link to="/profile">Profil</Link>
        <Link to="/login">Giriş</Link>
        <Link to="/register">Kayıt</Link>
      </nav>
      <div className="container">
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
    </div>
  );
}
