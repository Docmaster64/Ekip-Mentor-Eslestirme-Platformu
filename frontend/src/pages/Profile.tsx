import { useEffect, useState } from "react";
import { api } from "../api";

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState("");
  const [skills, setSkills] = useState("");
  const [interests, setInterests] = useState("");
  useEffect(() => {
    api("/api/auth/me").then((u) => {
      setUser(u);
      setName(u?.name || "");
      setSkills((u?.skills || []).join(", "));
      setInterests((u?.interests || []).join(", "));
    }).catch(() => {});
  }, []);
  const save = async () => {
    try { await api("/api/auth/me", { method: "PUT", body: JSON.stringify({ name, skills: skills.split(",").map((s) => s.trim()).filter(Boolean), interests: interests.split(",").map((s) => s.trim()).filter(Boolean) }) }); alert("Kaydedildi"); }
    catch (e: any) { alert(e.message); }
  };
  return (
    <div className="card" style={{ maxWidth: 480 }}>
      <h2>Profil</h2>
      <p className="muted">Rol: {user?.role || "-"}</p>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ad Soyad" />
      <input value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="Yetenekler (virgülle)" />
      <input value={interests} onChange={(e) => setInterests(e.target.value)} placeholder="İlgi alanları (virgülle)" />
      <button onClick={save}>Kaydet</button>
    </div>
  );
}
