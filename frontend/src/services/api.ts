/**
 * Central API helper for frontend.
 * - Respects NEXT_PUBLIC_API_URL (fallback to window.location.origin)
 * - Does NOT send credentials by default (avoid CORS preflight issues unless backend configured)
 * - Sends Authorization: Bearer <token> when token provided
 * - Normalizes JSON parsing and throws Error with payload on non-OK
 */
const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== "undefined" ? window.location.origin : "http://localhost:4001");

function joinUrl(base: string, path: string) {
  if (!path) return base;
  if (/^https?:\/\//.test(path)) return path;
  const b = base.replace(/\/+$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${b}${p}`;
}

async function fetchWithAuth(path: string, token?: string | null, opts: RequestInit = {}) {
  const url = joinUrl(API_BASE, path);
  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(opts.headers ? (opts.headers as Record<string, string>) : {}),
  };

  if (!(opts.body instanceof FormData) && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }
  if (token) headers["Authorization"] = `Bearer ${token}`;

  // debug: helps verify which base URL is used (remove in production)
  console.debug("[api] fetchWithAuth", { method: opts.method || "GET", url, tokenPresent: !!token });

  // NOTE: do NOT set credentials: "include" unless backend CORS is configured to allow credentials and exact origin
  const res = await fetch(url, { ...opts, headers, mode: "cors" });

  const text = await res.text().catch(() => "");
  let payload;
  try {
    payload = text ? JSON.parse(text) : {};
  } catch {
    payload = { raw: text };
  }

  if (!res.ok) {
    const msg = payload && (payload.message || payload.error || JSON.stringify(payload));
    const err: any = new Error(String(msg || res.statusText));
    err.status = res.status;
    err.payload = payload;
    console.error("[api] error", { url, status: res.status, payload });
    throw err;
  }

  return payload;
}

// Boards API helpers (frontend)
export async function getBoards(token?: string | null) {
  const payload = await fetchWithAuth("/boards", token);
  return payload.boards ?? payload;
}

export async function createBoard(title: string, token?: string | null, description?: string) {
  const body = { title, description };
  const payload = await fetchWithAuth("/boards", token, {
    method: "POST",
    body: JSON.stringify(body),
  });
  // backend returns { ok:true, board }
  return payload.board ?? payload;
}

export async function getBoard(id: string, token?: string | null) {
  const payload = await fetchWithAuth(`/boards/${encodeURIComponent(id)}`, token);
  return payload.board ?? payload;
}

export async function updateBoard(id: string, body: any, token?: string | null) {
  const payload = await fetchWithAuth(`/boards/${encodeURIComponent(id)}`, token, {
    method: "PUT",
    body: JSON.stringify(body),
  });
  return payload.board ?? payload;
}

export async function deleteBoard(id: string, token?: string | null) {
  const payload = await fetchWithAuth(`/boards/${encodeURIComponent(id)}`, token, {
    method: "DELETE",
  });
  return payload;
}

export async function addBoardColumn(boardId: string, column: { id?: string; title: string }, token?: string | null) {
  const payload = await fetchWithAuth(`/boards/${encodeURIComponent(boardId)}/columns`, token, {
    method: "POST",
    body: JSON.stringify(column),
  });
  // backend returns { ok:true, board }
  return payload.board ?? payload;
}

export { fetchWithAuth };