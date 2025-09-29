const admin = require("firebase-admin");
const db = admin.firestore();
const BOARDS = "boards";

function clean(obj = {}) {
  const out = { ...obj };
  Object.keys(out).forEach((k) => out[k] === undefined && delete out[k]);
  return out;
}

async function findByOwner(ownerId) {
  const snap = await db.collection(BOARDS).where("ownerId", "==", ownerId).get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

async function createBoard(payload) {
  const doc = clean({
    title: payload.title,
    description: payload.description,
    ownerId: payload.ownerId,
    members: Array.isArray(payload.members) ? payload.members : [],
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  const ref = await db.collection(BOARDS).add(doc);
  const snap = await ref.get();
  return { id: ref.id, ...snap.data() };
}

async function findById(id) {
  const ref = db.collection(BOARDS).doc(id);
  const snap = await ref.get();
  if (!snap.exists) return null;
  return { ref, data: snap.data() };
}

async function updateBoard(id, upd) {
  const ref = db.collection(BOARDS).doc(id);
  const payload = {};
  if (upd.title !== undefined) payload.title = upd.title;
  if (upd.description !== undefined) payload.description = upd.description;
  if (Array.isArray(upd.members)) payload.members = upd.members;
  const cleaned = clean({ ...payload, updatedAt: admin.firestore.FieldValue.serverTimestamp() });
  await ref.update(cleaned);
  const snap = await ref.get();
  return { id: snap.id, ...snap.data() };
}

async function deleteBoard(id) {
  await db.collection(BOARDS).doc(id).delete();
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

module.exports = {
  findByOwner,
  createBoard,
  findById,
  updateBoard,
  deleteBoard,
  ensureAccess,
};