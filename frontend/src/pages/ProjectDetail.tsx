import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { api, getToken } from "../api";
import { useToast } from "../components/Toast";

type Role = "STUDENT" | "FACULTY" | "ADMIN" | null;

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<any>(null);
  const [msg, setMsg] = useState("");
  const [sending, setSending] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<Role>(null);
  const { addToast } = useToast();

  useEffect(() => {
    const token = getToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setCurrentUserId(payload?.id || null);
        setCurrentUserRole((payload?.role as Role) || null);
      } catch {
        setCurrentUserId(null);
        setCurrentUserRole(null);
      }
    }

    api(`/api/projects/${id}`).then(setProject).catch(() => setProject(null));
  }, [id]);

  const sendRequest = async (type: "JOIN" | "MENTOR") => {
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

  const deleteProject = async () => {
    if (!window.confirm("Bu projeyi silmek istediğinizden emin misiniz?")) return;
    setDeleting(true);
    try {
      await api(`/api/projects/${id}`, { method: "DELETE" });
      addToast({
        title: "Proje Silindi",
        message: "Proje başarıyla kaldırıldı.",
        type: "info",
      });
      navigate("/projects");
    } catch (e: any) {
      alert(e.message || "Proje silinemedi.");
      setDeleting(false);
    }
  };

  const updateStatus = async (status: string) => {
    try {
      const updated = await api(`/api/projects/${id}`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });
      setProject(updated);
      addToast({
        title: "Durum Güncellendi",
        message: `Proje durumu güncellendi.`,
        type: "success",
      });
    } catch (e: any) {
      alert(e.message || "Güncellenemedi.");
    }
  };

  if (!project) return <div className="card" style={{ maxWidth: 600, margin: "20px auto" }}>Yükleniyor...</div>;

  const isOwner = currentUserId && project.ownerId === currentUserId;
  const isAdmin = currentUserRole === "ADMIN";
  const isStudent = currentUserRole === "STUDENT";
  const isFaculty = currentUserRole === "FACULTY";

  return (
    <div className="card" style={{ maxWidth: 800, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ margin: 0 }}>{project.title}</h2>
          {isOwner && (
            <span className="badge accent" style={{ marginTop: 6, display: "inline-block" }}>
              📌 Proje Sahibisiniz
            </span>
          )}
          {isAdmin && !isOwner && (
            <span className="badge" style={{ marginTop: 6, display: "inline-block" }}>
              🛡️ Yönetici Görünümü
            </span>
          )}
        </div>
        <span className={`status-pill ${project.status === "OPEN_TEAM" ? "team" : project.status === "OPEN_MENTOR" ? "mentor" : "muted"}`}>
          <span className="dot" />
          {project.status === "OPEN_TEAM"
            ? "Ekip Arkadaşı Aranıyor"
            : project.status === "OPEN_MENTOR"
            ? "Mentör Aranıyor"
            : "Kapatıldı"}
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

      {/* Proje Sahibi veya Admin Yönetim Alanı */}
      {(isOwner || isAdmin) && (
        <div style={{ marginTop: 20, padding: 16, background: "rgba(255,255,255,0.03)", borderRadius: 10, border: "1px dashed var(--border-strong)" }}>
          <h4 style={{ marginBottom: 10 }}>⚙️ Proje Yönetimi</h4>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            {isOwner && (
              <>
                <button
                  className="secondary"
                  style={{ fontSize: 12, padding: "6px 12px" }}
                  onClick={() => updateStatus(project.status === "OPEN_TEAM" ? "OPEN_MENTOR" : "OPEN_TEAM")}
                >
                  Durumu Değiştir ({project.status === "OPEN_TEAM" ? "Mentör Aranıyor Yap" : "Ekip Aranıyor Yap"})
                </button>
              </>
            )}
            <button
              onClick={deleteProject}
              disabled={deleting}
              style={{ fontSize: 12, padding: "6px 12px", background: "rgba(239, 68, 68, 0.2)", color: "#f87171", border: "1px solid rgba(239, 68, 68, 0.4)" }}
            >
              {deleting ? "Siliniyor..." : "Projeyi Sil"}
            </button>
          </div>
        </div>
      )}

      {/* Rol Tabanlı İstek / Teklif Alanı */}
      {!isOwner && (
        <div style={{ marginTop: 24, background: "rgba(255,255,255,0.02)", padding: 18, borderRadius: 12, border: "1px solid var(--border)" }}>
          {!currentUserRole ? (
            <div style={{ textAlign: "center", padding: "12px 0" }}>
              <p className="muted" style={{ marginBottom: 12 }}>İstek veya teklif gönderebilmek için giriş yapmalısınız.</p>
              <Link to="/login">
                <button style={{ padding: "8px 20px" }}>Giriş Yap</button>
              </Link>
            </div>
          ) : (
            <>
              <h3 style={{ marginBottom: 10, fontSize: 16 }}>
                {isStudent ? "Ekibe Katılma İsteği Gönder" : isFaculty ? "Mentörlük Teklifi Gönder" : "Yönetici İncelemesi"}
              </h3>
              <textarea
                placeholder={
                  isStudent
                    ? "Yeteneklerinizden ve projeye nasıl katkı sağlayabileceğinizden bahsedin..."
                    : "Projeye mentörlük desteği kapsamında önerilerinizi yazın..."
                }
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                rows={3}
              />
              <div style={{ marginTop: 12, display: "flex", gap: 12, flexWrap: "wrap" }}>
                {isStudent && (
                  <button disabled={sending} onClick={() => sendRequest("JOIN")}>
                    {sending ? "Gönderiliyor..." : "Katılma İsteği Gönder (Öğrenci)"}
                  </button>
                )}
                {isFaculty && (
                  <button disabled={sending} className="secondary" onClick={() => sendRequest("MENTOR")}>
                    {sending ? "Gönderiliyor..." : "Mentörlük Teklifi Gönder (Hoca)"}
                  </button>
                )}
                {isAdmin && (
                  <p className="muted" style={{ fontSize: 13, margin: 0 }}>
                    Yöneticiler doğrudan katılma veya mentörlük isteği gönderemez.
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
