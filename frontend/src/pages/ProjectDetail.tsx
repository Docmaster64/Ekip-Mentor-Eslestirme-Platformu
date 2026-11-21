import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../api";
import { useToast } from "../components/Toast";

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState<any>(null);
  const [msg, setMsg] = useState("");
  const [sending, setSending] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    api(`/api/projects/${id}`).then(setProject).catch(() => setProject(null));
  }, [id]);

  const sendRequest = async (type: string) => {
    setSending(true);
    try {
      await api("/api/requests", {
        method: "POST",
        body: JSON.stringify({ projectId: id, type, message: msg }),
      });
      setMsg("");
      addToast({
        title: "İstek Gönderildi 🎉",
        message: type === "MENTOR" ? "Mentörlük teklifiniz proje sahibine iletildi." : "Katılma isteğiniz proje sahibine iletildi.",
        type: "success",
      });
    } catch (e: any) {
      alert(e.message || "İstek gönderilemedi.");
    } finally {
      setSending(false);
    }
  };

  if (!project) return <div className="card" style={{ maxWidth: 600, margin: "20px auto" }}>Yükleniyor...</div>;

  return (
    <div className="card" style={{ maxWidth: 800, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
        <h2 style={{ margin: 0 }}>{project.title}</h2>
        <span className={`status-pill ${project.status === "OPEN_TEAM" ? "team" : "mentor"}`}>
          <span className="dot" />
          {project.status === "OPEN_TEAM" ? "Ekip Arkadaşı Aranıyor" : "Mentör Aranıyor"}
        </span>
      </div>

      {project.coverImage && (
        <img
          src={project.coverImage}
          alt="Proje kapak"
          style={{ width: "100%", maxHeight: 320, objectFit: "cover", borderRadius: 12, marginTop: 16 }}
        />
      )}

      <p style={{ marginTop: 16, fontSize: 15, lineHeight: 1.7 }}>{project.description}</p>

      {project.pdfUrl && (
        <div style={{ margin: "14px 0" }}>
          <a href={project.pdfUrl} target="_blank" rel="noopener noreferrer" className="badge accent" style={{ padding: "6px 14px", display: "inline-block" }}>
            📄 Tanıtım PDF'ini Görüntüle
          </a>
        </div>
      )}

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 14, padding: "12px 0", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <span className="muted">Kategori: <strong>{project.category}</strong></span>
        <span className="muted">Proje Sahibi: <strong>{project.owner?.name}</strong></span>
        {project.keywords && project.keywords.length > 0 && (
          <span className="muted">
            Etiketler: {project.keywords.map((k: string) => <span key={k} className="badge" style={{ marginLeft: 4 }}>{k}</span>)}
          </span>
        )}
      </div>

      <div style={{ marginTop: 24, background: "rgba(255,255,255,0.02)", padding: 18, borderRadius: 12, border: "1px solid var(--border)" }}>
        <h3 style={{ marginBottom: 10, fontSize: 16 }}>İstek / Teklif Gönder</h3>
        <textarea
          placeholder="Kendinizi tanıtın veya not ekleyin (opsiyonel)..."
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          rows={3}
        />
        <div style={{ marginTop: 12, display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button disabled={sending} onClick={() => sendRequest("JOIN")}>
            {sending ? "Gönderiliyor..." : "Katılma İsteği Gönder (Ekip)"}
          </button>
          <button disabled={sending} className="secondary" onClick={() => sendRequest("MENTOR")}>
            {sending ? "Gönderiliyor..." : "Mentörlük Teklifi Gönder (Hoca)"}
          </button>
        </div>
      </div>
    </div>
  );
}
