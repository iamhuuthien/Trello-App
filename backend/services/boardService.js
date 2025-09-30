const admin = require("firebase-admin");
const db = admin.firestore();

// --- added/changed: normalize columns and default ---

const DEFAULT_COLUMNS = [
  { id: "todo", title: "To do" },
  { id: "doing", title: "In progress" },
  { id: "review", title: "Review" },
  { id: "done", title: "Done" },
];

function normalizeColumns(columns) {
  if (!Array.isArray(columns)) return DEFAULT_COLUMNS;
  return columns
    .map((c) => {
      if (!c) return null;
      if (typeof c === "string") return { id: c, title: c };
      if (typeof c.id === "string") return { id: c.id, title: c.title ?? c.id };
      return null;
    })
    .filter(Boolean);
}

async function findByOwner(ownerId) {
  const snap = await db.collection("boards").where("ownerId", "==", ownerId).get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

async function createBoard(payload = {}) {
  const doc = {
    title: payload.title || "Untitled board",
    description: payload.description || "",
    ownerId: payload.ownerId || null,
    members: Array.isArray(payload.members) ? payload.members : [],
    columns: normalizeColumns(payload.columns),
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  };
  const ref = await db.collection("boards").add(doc);
  const snap = await ref.get();
  return { id: ref.id, ...snap.data() };
}

async function findById(id) {
  const ref = db.collection("boards").doc(id);
  const snap = await ref.get();
  if (!snap.exists) return null;
  return { ref, data: snap.data() };
}

async function updateBoard(id, updates = {}) {
  const ref = db.collection("boards").doc(id);
  const payload = {};
  if (updates.title !== undefined) payload.title = updates.title;
  if (updates.description !== undefined) payload.description = updates.description;
  if (Array.isArray(updates.members)) payload.members = updates.members;
  if (updates.columns !== undefined) payload.columns = normalizeColumns(updates.columns);
  if (Object.keys(payload).length === 0) {
    // nothing to update
    const snap = await ref.get();
    return { id: snap.id, ...snap.data() };
  }
  payload.updatedAt = admin.firestore.FieldValue.serverTimestamp();
  await ref.update(payload);
  const snap = await ref.get();
  return { id: snap.id, ...snap.data() };
}

async function deleteBoard(id) {
  await db.collection("boards").doc(id).delete();
  return true;
}

async function ensureAccess(boardId, requesterEmail) {
  const r = await findById(boardId);
  if (!r) return { status: 404, body: { error: "not_found" } };
  const requester = `user:${String(requesterEmail).toLowerCase()}`;
  const isOwner = r.data.ownerId === requester;
  const isMember = Array.isArray(r.data.members) && r.data.members.includes(requester);
  if (!isOwner && !isMember) return { status: 403, body: { error: "forbidden" } };
  return { status: 200, boardRef: r.ref, board: r.data, isOwner, isMember };
}

// export (ensure existing exports include these)
module.exports = {
  findByOwner,
  createBoard,
  findById,
  updateBoard,
  deleteBoard,
  ensureAccess,
  normalizeColumns,
  DEFAULT_COLUMNS,
};