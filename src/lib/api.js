const API = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000";

export const getToken = () => localStorage.getItem("token");
export const setToken = (t) => localStorage.setItem("token", t);

// logging out also forgets the assistant conversation
export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("chatSession");
  localStorage.removeItem("chatMessages");
}

// one id per login session, so each login starts a fresh assistant conversation
export function chatSessionId() {
  let id = localStorage.getItem("chatSession");
  if (!id) {
    id = crypto.randomUUID?.() ?? Math.random().toString(36).slice(2);
    localStorage.setItem("chatSession", id);
  }
  return id;
}

// Reads id + role from the JWT. UI only: the server still enforces everything.
export function getUser() {
  const token = getToken();
  if (!token) return null;
  try {
    const b64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(b64));
    if (payload.exp * 1000 < Date.now()) {
      logout();
      return null;
    }
    return { id: Number(payload.sub), role: payload.role };
  } catch {
    logout();
    return null;
  }
}

export async function api(path, { method = "GET", body, form } = {}) {
  const headers = {};
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let payload;
  if (form) {
    headers["Content-Type"] = "application/x-www-form-urlencoded";
    payload = new URLSearchParams(form);
  } else if (body) {
    headers["Content-Type"] = "application/json";
    payload = JSON.stringify(body);
  }

  const res = await fetch(`${API}${path}`, { method, headers, body: payload });

  if (res.status === 401 && token) {
    logout();
    // come back to this page after logging in again
    sessionStorage.setItem("redirectAfterLogin", window.location.pathname + window.location.search);
    window.location.href = "/login";
    throw new Error("Session expired, please log in again");
  }
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(typeof data?.detail === "string" ? data.detail : "Something went wrong");
  }
  return data;
}

// where to go after logging in: the page the visitor wanted, else their home
export function afterLoginPath(user, from) {
  const saved = sessionStorage.getItem("redirectAfterLogin");
  sessionStorage.removeItem("redirectAfterLogin");
  const target = saved || from;
  if (target?.startsWith("/") && !target.startsWith("//")) return target;
  return user?.role === "admin" ? "/admin" : "/shop";
}