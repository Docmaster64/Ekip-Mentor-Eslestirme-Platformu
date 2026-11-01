import { useEffect, useState } from "react";
import { api } from "../api";

export default function Inbox() {
  const [requests, setRequests] = useState<any[]>([]);
  const load = async () => { try { setRequests(await api("/api/requests/inbox")); } catch { setRequests([]); } };
  useEffect(() => { load(); }, []);
  const decide = async (id: string, status: string) => {
    try { await api(`/api/requests/${id}`, { method: "PATCH", body: JSON.stringify({ status }) }); load(); }
    catch (e: any) { alert(e.message); }
  };
  return (
    <div>
      <h2>Gelen İstekler</h2>
      {requests.length === 0 && <p className="muted">Gelen istek yok.</p>}
      {requests.map((r) => (
        <div className="card" key={r.id}>
          <p style={{ margin: 0 }}><strong>{r.type}</strong> — {r.sender?.name} <span className="badge">{r.status}</span></p>
          {r.message && <p className="muted" style={{ margin: "4px 0" }}>{r.message}</p>}
          {r.status === "PENDING" && (
            <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
              <button onClick={() => decide(r.id, "ACCEPTED")}>Kabul</button>
              <button className="secondary" onClick={() => decide(r.id, "REJECTED")}>Reddet</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
