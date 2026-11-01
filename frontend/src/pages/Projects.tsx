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
    setProjects(await api(`/api/projects?${q.toString()}`));
  };
  useEffect(() => { load(); }, []);
  return (
    <div style={{ padding: 24 }}>
      <h2>Projeler</h2>
      <div style={{ marginBottom: 12 }}>
        <input placeholder="Anahtar kelime" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
        <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ marginLeft: 8 }}>
          <option value="">Tümü</option>
          <option value="OPEN_TEAM">Ekip arkadaşı aranıyor</option>
          <option value="OPEN_MENTOR">Mentör aranıyor</option>
        </select>
        <button onClick={load} style={{ marginLeft: 8 }}>Filtrele</button>
      </div>
      <ul>
        {projects.map((p) => (
          <li key={p.id}><Link to={`/projects/${p.id}`}>{p.title}</Link> — {p.status} ({p.category})</li>
        ))}
      </ul>
    </div>
  );
}
