import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const nav = useNavigate();
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await api("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
      localStorage.setItem("token", data.token);
      nav("/projects");
    } catch (e: any) { setErr(e.message); }
  };
  return (
    <form onSubmit={submit} style={{ padding: 24, maxWidth: 360 }}>
      <h2>Giriş</h2>
      <input placeholder="E-posta" value={email} onChange={(e) => setEmail(e.target.value)} style={{ display: "block", width: "100%", margin: "8px 0" }} />
      <input type="password" placeholder="Şifre" value={password} onChange={(e) => setPassword(e.target.value)} style={{ display: "block", width: "100%", margin: "8px 0" }} />
      <button type="submit">Giriş Yap</button>
      {err && <p style={{ color: "red" }}>{err}</p>}
    </form>
  );
}
