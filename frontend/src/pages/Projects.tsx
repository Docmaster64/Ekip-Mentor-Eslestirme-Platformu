import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";

export default function Projects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("");
  const load = async () => {
    const q = new URLSearchParams();
    if (keyword) q.set("keyword", keyword);
    if (status) q.set("status", status);
    try { setProjects(await api(`/api/projects?${q.toString()}`)); } catch { setProjects([]); }
  };
  useEffect(() => { load(); }, []);
  return (
    <div>
      <h2>Projeler</h2>
      <div className="card" style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        <input placeholder="Anahtar kelime" value={keyword} onChange={(e) => setKeyword(e.target.value)} style={{ flex: 1, minWidth: 160 }} />
        <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ width: 200 }}>
          <option value="">Tümü</option>
          <option value="OPEN_TEAM">Ekip arkadaşı aranıyor</option>
          <option value="OPEN_MENTOR">Mentör aranıyor</option>
        </select>
        <button onClick={load}>Filtrele</button>
      </div>
      <div className="grid" style={{ marginTop: 16 }}>
        {projects.map((p) => (
          <div className="card" key={p.id}>
            <h3 style={{ margin: "0 0 8px" }}><Link to={`/projects/${p.id}`}>{p.title}</Link></h3>
            <p className="muted" style={{ margin: "0 0 8px" }}>{p.description?.slice(0, 100)}</p>
            <span className="badge">{p.status}</span>
            <span className="badge" style={{ marginLeft: 6 }}>{p.category}</span>
          </div>
        ))}
      </div>
      {projects.length === 0 && <p className="muted">Henüz proje yok. Giriş yapıp yeni proje ekleyebilirsin.</p>}
    </div>
  );
}
