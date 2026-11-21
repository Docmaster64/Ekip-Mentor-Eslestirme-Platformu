import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import { getSocket } from "../socket";
import { useToast } from "../components/Toast";

export default function Inbox() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState<string | null>(null);
  const { addToast } = useToast();

  const load = useCallback(async () => {
    try {
      const data = await api("/api/requests/inbox");
      setRequests(Array.isArray(data) ? data : []);
    } catch {
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();

    // Socket.IO canlı güncelleme
    const socket = getSocket();
    const handleUpdate = () => {
      load();
    };

    socket.on("newRequest", handleUpdate);
    socket.on("requestUpdated", handleUpdate);

    return () => {
      socket.off("newRequest", handleUpdate);
      socket.off("requestUpdated", handleUpdate);
    };
  }, [load]);

  const decide = async (id: string, status: "ACCEPTED" | "REJECTED") => {
    setActingId(id);
    try {
      await api(`/api/requests/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      addToast({
        title: status === "ACCEPTED" ? "İstek Kabul Edildi" : "İstek Reddedildi",
        message: status === "ACCEPTED" ? "Kullanıcı projeye kabul edildi." : "İstek reddedildi.",
        type: status === "ACCEPTED" ? "success" : "warning",
      });
      load();
    } catch (e: any) {
      alert(e.message || "İşlem başarısız oldu.");
    } finally {
      setActingId(null);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2>Gelen İstekler ve Teklifler</h2>
        <button className="secondary" style={{ padding: "6px 14px", fontSize: 13 }} onClick={load}>
          Yenile
        </button>
      </div>

      {loading && <div className="card">Yükleniyor...</div>}

      {!loading && requests.length === 0 && (
        <div className="card empty">
          <div className="icon">📬</div>
          <h3>Henüz gelen bir istek yok</h3>
          <p className="muted">Projelerinize yeni bir ekip katılma isteği veya mentörlük teklifi geldiğinde burada görünecek.</p>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {requests.map((r) => {
          const isPending = r.status === "PENDING";
          const isAccepted = r.status === "ACCEPTED";
          const isRejected = r.status === "REJECTED";

          return (
            <div className="card" key={r.id} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
                <div>
                  <span className={`status-pill ${r.type === "MENTOR" ? "mentor" : "team"}`} style={{ marginRight: 8 }}>
                    {r.type === "MENTOR" ? "Mentörlük Teklifi" : "Ekip Katılma İsteği"}
                  </span>
                  <span style={{ fontWeight: 600, fontSize: 15 }}>{r.sender?.name}</span>
                  {r.sender?.role && (
                    <span className="badge" style={{ marginLeft: 6, fontSize: 11 }}>
                      {r.sender.role === "FACULTY" ? "Hoca" : r.sender.role === "STUDENT" ? "Öğrenci" : "Yönetici"}
                    </span>
                  )}
                </div>

                <span
                  className="badge"
                  style={{
                    backgroundColor: isAccepted ? "rgba(34,197,94,0.18)" : isRejected ? "rgba(239,68,68,0.18)" : "rgba(245,158,11,0.18)",
                    color: isAccepted ? "#4ade80" : isRejected ? "#f87171" : "#fbbf24",
                    border: `1px solid ${isAccepted ? "rgba(34,197,94,0.3)" : isRejected ? "rgba(239,68,68,0.3)" : "rgba(245,158,11,0.3)"}`,
                  }}
                >
                  {isAccepted ? "Kabul Edildi" : isRejected ? "Reddedildi" : "Beklemede"}
                </span>
              </div>

              {r.project && (
                <p style={{ margin: 0, fontSize: 14 }}>
                  <span className="muted">İlgili Proje: </span>
                  <Link to={`/projects/${r.projectId}`} style={{ fontWeight: 600 }}>
                    {r.project.title}
                  </Link>
                </p>
              )}

              {r.message && (
                <div style={{ background: "rgba(255,255,255,0.03)", padding: "10px 14px", borderRadius: 8, fontSize: 13, borderLeft: "3px solid var(--border-strong)" }}>
                  <span className="muted">Mesaj: </span>"{r.message}"
                </div>
              )}

              {isPending && (
                <div style={{ marginTop: 6, display: "flex", gap: 10 }}>
                  <button
                    disabled={actingId === r.id}
                    onClick={() => decide(r.id, "ACCEPTED")}
                    style={{ padding: "8px 18px", fontSize: 13 }}
                  >
                    {actingId === r.id ? "İşleniyor..." : "Kabul Et"}
                  </button>
                  <button
                    className="secondary"
                    disabled={actingId === r.id}
                    onClick={() => decide(r.id, "REJECTED")}
                    style={{ padding: "8px 18px", fontSize: 13 }}
                  >
                    Reddet
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
