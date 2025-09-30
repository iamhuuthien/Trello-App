const admin = require("firebase-admin");
const db = admin.firestore();
const BOARDS = "boards";

function toUserId(idOrEmail) {
  if (!idOrEmail) return null;
  if (typeof idOrEmail !== "string") return null;
  if (idOrEmail.startsWith("user:")) return idOrEmail;
  if (idOrEmail.includes("@")) return `user:${String(idOrEmail).toLowerCase()}`;
  return idOrEmail;
}

function clean(obj = {}) {
  const out = { ...obj };
  Object.keys(out).forEach((k) => out[k] === undefined && delete out[k]);
  return out;
}

async function listCards(boardId) {
  const snap = await db.collection(BOARDS).doc(boardId).collection("cards").get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

async function createCard(boardId, payload) {
  const members = Array.isArray(payload.members) ? payload.members.map(toUserId).filter(Boolean) : [];
  const doc = clean({
    name: payload.name,
    description: payload.description,
    status: payload.status,
    members,
    priority: payload.priority,
    deadline: payload.deadline ?? null,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  const ref = await db.collection(BOARDS).doc(boardId).collection("cards").add(doc);
  const data = (await ref.get()).data();
  return { id: ref.id, ...data };
}

async function getCard(boardId, cardId) {
  const snap = await db.collection(BOARDS).doc(boardId).collection("cards").doc(cardId).get();
  if (!snap.exists) return null;
  return { id: snap.id, ...snap.data() };
}

async function updateCard(boardId, cardId, upd) {
  const ref = db.collection(BOARDS).doc(boardId).collection("cards").doc(cardId);
  const payload = {};
  if (upd.name !== undefined) payload.name = upd.name;
  if (upd.description !== undefined) payload.description = upd.description;
  if (upd.status !== undefined) payload.status = upd.status;
  if (Array.isArray(upd.members)) payload.members = upd.members.map(toUserId).filter(Boolean);
  if (upd.priority !== undefined) payload.priority = upd.priority;
  if (Object.prototype.hasOwnProperty.call(upd, "deadline")) payload.deadline = upd.deadline;
  const cleaned = clean({ ...payload, updatedAt: admin.firestore.FieldValue.serverTimestamp() });
  await ref.update(cleaned);
  const snap = await ref.get();
  return { id: snap.id, ...snap.data() };
}

async function deleteCard(boardId, cardId) {
  const ref = db.collection(BOARDS).doc(boardId).collection("cards").doc(cardId);
  // delete tasks subcollection (best-effort)
  const tasks = await ref.collection("tasks").get();
  for (const t of tasks.docs) await t.ref.delete();
  await ref.delete();
  return true;
}

async function listCardsByUser(boardId, userParam) {
  const userId = toUserId(userParam);
  if (!userId) return [];
  const snap = await db.collection(BOARDS).doc(boardId).collection("cards").where("members", "array-contains", userId).get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

module.exports = {
  listCards,
  createCard,
  getCard,
  updateCard,
  deleteCard,
  listCardsByUser,
  toUserId,
};