import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

export default function Register() {
  const [form, setForm] = useState({ email: "", password: "", name: "", role: "STUDENT" });
  const [err, setErr] = useState("");
  const nav = useNavigate();
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await api("/api/auth/register", { method: "POST", body: JSON.stringify(form) });
      localStorage.setItem("token", data.token);
      nav("/projects");
    } catch (e: any) { setErr(e.message); }
  };
  return (
    <div className="card form">
      <h2>Kayıt</h2>
      <form onSubmit={submit}>
        <input placeholder="Ad Soyad" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input placeholder="E-posta" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input type="password" placeholder="Şifre" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <option value="STUDENT">Öğrenci</option>
          <option value="FACULTY">Hoca</option>
        </select>
        <button type="submit">Kayıt Ol</button>
        {err && <p style={{ color: "#f87171" }}>{err}</p>}
      </form>
    </div>
  );
}
