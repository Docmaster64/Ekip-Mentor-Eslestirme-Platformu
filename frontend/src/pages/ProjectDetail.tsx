import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api";

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState<any>(null);
  const [msg, setMsg] = useState("");
  useEffect(() => { api(`/api/projects/${id}`).then(setProject); }, [id]);
  const sendRequest = async (type: string) => {
    await api("/api/requests", { method: "POST", body: JSON.stringify({ projectId: id, type, message: msg }) });
    alert("İstek gönderildi");
  };
  if (!project) return <div style={{ padding: 24 }}>Yükleniyor...</div>;
  return (
    <div style={{ padding: 24 }}>
      <h2>{project.title}</h2>
      <p>{project.description}</p>
      <p>Durum: {project.status} | Kategori: {project.category}</p>
      <p>Sahip: {project.owner?.name}</p>
      <textarea placeholder="Mesaj" value={msg} onChange={(e) => setMsg(e.target.value)} style={{ width: "100%", height: 80 }} />
      <div style={{ marginTop: 8 }}>
        <button onClick={() => sendRequest("JOIN")} style={{ marginRight: 8 }}>Katılma İsteği Gönder</button>
        <button onClick={() => sendRequest("MENTOR")}>Mentörlük Teklifi Gönder</button>
      </div>
    </div>
  );
}
