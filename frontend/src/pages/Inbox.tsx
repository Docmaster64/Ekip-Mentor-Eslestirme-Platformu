import { useEffect, useState } from "react";
import { api } from "../api";

export default function Inbox() {
  const [requests, setRequests] = useState<any[]>([]);
  const load = async () => setRequests(await api("/api/requests/inbox"));
  useEffect(() => { load(); }, []);
  const decide = async (id: string, status: string) => {
    await api(`/api/requests/${id}`, { method: "PATCH", body: JSON.stringify({ status }) });
    load();
  };
  return (
    <div style={{ padding: 24 }}>
      <h2>Gelen İstekler</h2>
      <ul>
        {requests.map((r) => (
          <li key={r.id}>
            {r.type} — {r.sender?.name} — {r.status}
            {r.status === "PENDING" && (
              <>
                <button onClick={() => decide(r.id, "ACCEPTED")} style={{ marginLeft: 8 }}>Kabul</button>
                <button onClick={() => decide(r.id, "REJECTED")} style={{ marginLeft: 4 }}>Reddet</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
