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
    await api("/api/auth/me", { method: "PUT", body: JSON.stringify({ name, skills: skills.split(",").map((s) => s.trim()).filter(Boolean), interests: interests.split(",").map((s) => s.trim()).filter(Boolean) }) });
    alert("Kaydedildi");
  };
  return (
    <div style={{ padding: 24, maxWidth: 480 }}>
      <h2>Profil</h2>
      <p>Rol: {user?.role}</p>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ad Soyad" style={{ display: "block", width: "100%", margin: "8px 0" }} />
      <input value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="Yetenekler (virgülle)" style={{ display: "block", width: "100%", margin: "8px 0" }} />
      <input value={interests} onChange={(e) => setInterests(e.target.value)} placeholder="İlgi alanları (virgülle)" style={{ display: "block", width: "100%", margin: "8px 0" }} />
      <button onClick={save}>Kaydet</button>
    </div>
  );
}
