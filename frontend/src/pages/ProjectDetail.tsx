import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api";
import { MOCK_PROJECTS } from "../mockData";

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState<any>(null);
  const [msg, setMsg] = useState("");
  useEffect(() => {
    api(`/api/projects/${id}`).then(setProject).catch(() => {
      const m = MOCK_PROJECTS.find((p) => p.id === id);
      if (m) setProject(m);
    });
  }, [id]);
  const sendRequest = async (type: string) => {
    try { await api("/api/requests", { method: "POST", body: JSON.stringify({ projectId: id, type, message: msg }) }); alert("İstek gönderildi"); }
    catch (e: any) { alert("Demo modu: istek kaydedilemedi (DB bağlı değil)."); }
  };
  if (!project) return <div className="card">Yükleniyor...</div>;
  return (
    <div className="card">
      <h2>{project.title}</h2>
      <div style={{ margin: "8px 0 12px" }}>
        <span className={`status-pill ${project.status === "OPEN_TEAM" ? "team" : "mentor"}`}>
          <span className="dot" />
          {project.status === "OPEN_TEAM" ? "Ekip Arkadaşı Aranıyor" : "Mentör Aranıyor"}
        </span>
      </div>
      <p>{project.description}</p>
      <p className="muted">Kategori: {project.category}</p>
      <p className="muted">Sahip: {project.owner?.name}</p>
      <textarea placeholder="Mesaj (opsiyonel)" value={msg} onChange={(e) => setMsg(e.target.value)} />
      <div style={{ marginTop: 8, display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button onClick={() => sendRequest("JOIN")}>Katılma İsteği Gönder</button>
        <button className="secondary" onClick={() => sendRequest("MENTOR")}>Mentörlük Teklifi Gönder</button>
      </div>
    </div>
  );
}
