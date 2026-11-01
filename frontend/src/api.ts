const API = import.meta.env.VITE_API_URL || "http://localhost:4000";
export function getToken() { return localStorage.getItem("token"); }
export async function api(path: string, opts: RequestInit = {}) {
  const token = getToken();
  const res = await fetch(`${API}${path}`, {
    ...opts,
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(opts.headers || {}) },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
export { API };
