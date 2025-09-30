const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4001";

function getStoredToken(): string | null {
  if (typeof window !== "undefined") {
    // check both keys: older code uses "trello_token", helper uses "token"
    return (
      window.localStorage.getItem("token") ||
      window.localStorage.getItem("trello_token") ||
      null
    );
  }
  return process.env.NEXT_PUBLIC_API_TOKEN || null;
}

/**
 * fetch helper:
 * - token === undefined => try read stored token (localStorage or NEXT_PUBLIC_API_TOKEN)
 * - token === null => explicitly do NOT send Authorization
 * - token (string) => use provided token
 */
async function fetchWithAuth(path: string, token?: string | null, opts: RequestInit = {}) {
  const resolvedToken = token === undefined ? getStoredToken() : token;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(opts.headers as Record<string, string> | undefined),
  };
  if (resolvedToken) headers["Authorization"] = `Bearer ${resolvedToken}`;

  const res = await fetch(`${API_BASE}${path}`, { ...opts, headers });
  const text = await res.text().catch(() => "");
  let json: any = {};
  try { json = text ? JSON.parse(text) : {}; } catch { json = { raw: text }; }
  if (!res.ok) {
    const err = new Error(json?.message || json?.error || json?.error_description || "API error");
    (err as any).payload = json;
    throw err;
  }
  return json;
}

// helpers to manage token from UI
export function setAuthToken(token?: string | null) {
  if (typeof window === "undefined") return;
  if (token) {
    // keep both keys in sync so different pages/components work
    window.localStorage.setItem("token", token);
    window.localStorage.setItem("trello_token", token);
  } else {
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("trello_token");
  }
}

export function getAuthToken() {
  return getStoredToken();
}

export async function getBoards(token?: string | null) {
  const res = await fetchWithAuth("/boards", token);
  return res.boards || [];
}

export async function getBoard(id: string, token?: string | null) {
  const res = await fetchWithAuth(`/boards/${id}`, token);
  return res.board || null;
}

export async function getCards(boardId: string, token?: string | null) {
  const res = await fetchWithAuth(`/boards/${boardId}/cards`, token);
  return res.cards || [];
}

export async function createCard(boardId: string, body: any, token?: string | null) {
  const res = await fetchWithAuth(`/boards/${boardId}/cards`, token, {
    method: "POST",
    body: JSON.stringify(body),
  });
  return res.card;
}

export async function updateCard(boardId: string, cardId: string, body: any, token?: string | null) {
  const res = await fetchWithAuth(`/boards/${boardId}/cards/${cardId}`, token, {
    method: "PUT",
    body: JSON.stringify(body),
  });
  return res.card;
}

export async function getTasks(boardId: string, cardId: string, token?: string | null) {
  const res = await fetchWithAuth(`/boards/${boardId}/cards/${cardId}/tasks`, token);
  return res.tasks || [];
}

export async function createTask(boardId: string, cardId: string, body: any, token?: string | null) {
  const res = await fetchWithAuth(`/boards/${boardId}/cards/${cardId}/tasks`, token, {
    method: "POST",
    body: JSON.stringify(body),
  });
  return res.task;
}

/* Boards */
export async function createBoard(title: string, token?: string | null, description?: string) {
  const payload = await fetchWithAuth("/boards", token, {
    method: "POST",
    body: JSON.stringify({ title, description }),
  });
  return payload.board;
}

export async function updateBoard(id: string, body: any, token?: string | null) {
  const res = await fetchWithAuth(`/boards/${encodeURIComponent(id)}`, token, {
    method: "PUT",
    body: JSON.stringify(body),
  });
  // normalize response: backend returns { ok: true, board: {...} }
  return res.board ?? res;
}

export async function deleteBoard(id: string, token?: string | null) {
  const res = await fetchWithAuth(`/boards/${encodeURIComponent(id)}`, token, {
    method: "DELETE",
  });
  // return boolean-like or payload for caller
  return res;
}

/* Cards (spec uses field `name`) */
export async function getCard(boardId: string, cardId: string, token?: string | null) {
  const payload = await fetchWithAuth(`/boards/${encodeURIComponent(boardId)}/cards/${encodeURIComponent(cardId)}`, token, { method: "GET" });
  return payload.card;
}

export async function deleteCard(boardId: string, cardId: string, token?: string | null) {
  const payload = await fetchWithAuth(`/boards/${encodeURIComponent(boardId)}/cards/${encodeURIComponent(cardId)}`, token, {
    method: "DELETE",
  });
  return payload;
}

export async function getCardsByUser(boardId: string, userId: string, token?: string | null) {
  const payload = await fetchWithAuth(`/boards/${encodeURIComponent(boardId)}/cards/user/${encodeURIComponent(userId)}`, token, { method: "GET" });
  return payload.cards ?? [];
}

/* Tasks under a card */
export async function updateTask(boardId: string, cardId: string, taskId: string, body: any, token?: string | null) {
  const payload = await fetchWithAuth(`/boards/${encodeURIComponent(boardId)}/cards/${encodeURIComponent(cardId)}/tasks/${encodeURIComponent(taskId)}`, token, {
    method: "PUT",
    body: JSON.stringify(body),
  });
  return payload.task;
}

export async function deleteTask(boardId: string, cardId: string, taskId: string, token?: string | null) {
  const payload = await fetchWithAuth(`/boards/${encodeURIComponent(boardId)}/cards/${encodeURIComponent(cardId)}/tasks/${encodeURIComponent(taskId)}`, token, {
    method: "DELETE",
  });
  return payload;
}

export async function assignTask(boardId: string, cardId: string, taskId: string, body: { userId?: string; email?: string }, token?: string | null) {
  const payload = await fetchWithAuth(`/boards/${encodeURIComponent(boardId)}/cards/${encodeURIComponent(cardId)}/tasks/${encodeURIComponent(taskId)}/assign`, token, {
    method: "POST",
    body: JSON.stringify(body),
  });
  return payload;
}

export async function unassignTask(boardId: string, cardId: string, taskId: string, body: { userId?: string; email?: string }, token?: string | null) {
  const payload = await fetchWithAuth(`/boards/${encodeURIComponent(boardId)}/cards/${encodeURIComponent(cardId)}/tasks/${encodeURIComponent(taskId)}/assign`, token, {
    method: "DELETE",
    body: JSON.stringify(body),
  });
  return payload;
}

/* Invites */
export async function createInvite(boardId: string, body: { inviteToEmail: string }, token?: string | null) {
  const payload = await fetchWithAuth(`/boards/${encodeURIComponent(boardId)}/invite`, token, {
    method: "POST",
    body: JSON.stringify(body),
  });
  return payload;
}

export async function acceptInvite(boardId: string, cardId: string, body: { invitationId: string }, token?: string | null) {
  const payload = await fetchWithAuth(`/boards/${encodeURIComponent(boardId)}/cards/${encodeURIComponent(cardId)}/invite/accept`, token, {
    method: "POST",
    body: JSON.stringify(body),
  });
  return payload;
}