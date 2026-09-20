// ============================================================
// classesApi.js — talks to the SEPARATE classes backend
// (talkwithshivah-classes-backend on Render), not MentorHub.
// Public calls send no token. Admin calls use their own token,
// stored under a different key from the MentorHub login.
// ============================================================
const BASE = (import.meta.env.VITE_CLASSES_API_URL || "http://localhost:5001/api").replace(/\/$/, "");
const ADMIN_KEY = "twsClassesAdminToken";

export const adminToken = {
  get: () => localStorage.getItem(ADMIN_KEY),
  set: (t) => localStorage.setItem(ADMIN_KEY, t),
  clear: () => localStorage.removeItem(ADMIN_KEY),
};

const request = async (method, path, body, { admin = false } = {}) => {
  const headers = { "Content-Type": "application/json" };
  if (admin) {
    const t = adminToken.get();
    if (t) headers.Authorization = `Bearer ${t}`;
  }
  let res;
  try {
    res = await fetch(`${BASE}${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined });
  } catch {
    throw new Error("Can't reach the server. Check your connection and try again.");
  }
  const text = await res.text();
  let data;
  try { data = text ? JSON.parse(text) : {}; } catch { data = { message: text }; }

  if (!res.ok) {
    if (admin && res.status === 401) adminToken.clear();
    const err = new Error(data.message || "Something went wrong");
    err.status = res.status;
    throw err;
  }
  return data;
};

// ---- Public ----
export const classesAPI = {
  list: () => request("GET", "/classes"),
  get: (slug) => request("GET", `/classes/${encodeURIComponent(slug)}`),
  register: (slug, data) => request("POST", `/classes/${encodeURIComponent(slug)}/register`, data),
  status: (key) => request("GET", `/classes/registration/${encodeURIComponent(key)}`),
  resubmit: (key, utr) => request("POST", `/classes/registration/${encodeURIComponent(key)}/resubmit`, { utr }),
};

// ---- Admin (/manage) ----
const a = (m, p, b) => request(m, p, b, { admin: true });
export const classesAdminAPI = {
  login: (email, password) => request("POST", "/admin/login", { email, password }),
  me: () => a("GET", "/admin/me"),
  list: () => a("GET", "/admin/classes"),
  create: (data) => a("POST", "/admin/classes", data),
  update: (id, data) => a("PUT", `/admin/classes/${id}`, data),
  remove: (id) => a("DELETE", `/admin/classes/${id}`),
  registrations: (id) => a("GET", `/admin/classes/${id}/registrations`),
  approve: (id) => a("PUT", `/admin/registrations/${id}/approve`),
  reject: (id, reason) => a("PUT", `/admin/registrations/${id}/reject`, { reason }),
  toggleAttended: (id) => a("PUT", `/admin/registrations/${id}/attended`),
  removeRegistration: (id) => a("DELETE", `/admin/registrations/${id}`),
  getSettings: () => a("GET", "/admin/settings"),
  saveSettings: (data) => a("PUT", "/admin/settings", data),
};

// Where a person's status key is remembered on this device
export const savedRegKey = {
  get: (slug) => localStorage.getItem(`twsClassReg:${slug}`),
  set: (slug, key) => localStorage.setItem(`twsClassReg:${slug}`, key),
  clear: (slug) => localStorage.removeItem(`twsClassReg:${slug}`),
};
