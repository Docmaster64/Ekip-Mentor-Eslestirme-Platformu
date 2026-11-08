import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api";

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState<any>(null);
  const [msg, setMsg] = useState("");
  useEffect(() => {
    api(`/api/projects/${id}`).then(setProject).catch(() => setProject(null));
  }, [id]);
  const sendRequest = async (type: string) => {
    try { await api("/api/requests", { method: "POST", body: JSON.stringify({ projectId: id, type, message: msg }) }); alert("İstek gönderildi"); }
    catch (e: any) { alert("Demo modu: istek kaydedilemedi (DB bağlı değil)."); }
  };
  if (!project) return <div className="card">Yükleniyor...</div>;
  return (
    <div className="card">
      <h2>{project.title}</h2>
      {project.coverImage && (
        <img src={project.coverImage} alt="Proje kapak" style={{ width: "100%", maxHeight: 300, objectFit: "cover", borderRadius: 10, marginBottom: 16 }} />
      )}
      <div style={{ margin: "8px 0 12px" }}>
        <span className={`status-pill ${project.status === "OPEN_TEAM" ? "team" : "mentor"}`}>
          <span className="dot" />
          {project.status === "OPEN_TEAM" ? "Ekip Arkadaşı Aranıyor" : "Mentör Aranıyor"}
        </span>
      </div>
      <p>{project.description}</p>
      {project.pdfUrl && (
        <a href={project.pdfUrl} target="_blank" rel="noopener noreferrer" className="badge accent">
          PDF'yi Goruntule
        </a>
      )}
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
