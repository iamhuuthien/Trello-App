const admin = require("firebase-admin");
const db = admin.firestore();
const BOARDS = "boards";

function clean(obj = {}) {
  const out = { ...obj };
  Object.keys(out).forEach((k) => out[k] === undefined && delete out[k]);
  return out;
}

async function listTasks(boardId, cardId) {
  const snap = await db.collection(BOARDS).doc(boardId).collection("cards").doc(cardId).collection("tasks").get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

async function createTask(boardId, cardId, payload) {
  const doc = clean({
    title: payload.title,
    description: payload.description,
    status: payload.status,
    ownerId: payload.ownerId ?? null,
    assigned: Array.isArray(payload.assigned) ? payload.assigned : [],
    attachments: payload.attachments || [],
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  const ref = await db.collection(BOARDS).doc(boardId).collection("cards").doc(cardId).collection("tasks").add(doc);
  const data = (await ref.get()).data();
  return { id: ref.id, ...data };
}

async function getTask(boardId, cardId, taskId) {
  const snap = await db.collection(BOARDS).doc(boardId).collection("cards").doc(cardId).collection("tasks").doc(taskId).get();
  if (!snap.exists) return null;
  return { id: snap.id, ...snap.data() };
}

async function updateTask(boardId, cardId, taskId, upd) {
  const ref = db.collection(BOARDS).doc(boardId).collection("cards").doc(cardId).collection("tasks").doc(taskId);
  const payload = {};
  if (upd.title !== undefined) payload.title = upd.title;
  if (upd.description !== undefined) payload.description = upd.description;
  if (upd.status !== undefined) payload.status = upd.status;
  if (upd.ownerId !== undefined) payload.ownerId = upd.ownerId;
  if (Array.isArray(upd.assigned)) payload.assigned = upd.assigned;
  if (upd.attachments !== undefined) payload.attachments = upd.attachments;
  const cleaned = clean({ ...payload, updatedAt: admin.firestore.FieldValue.serverTimestamp() });
  await ref.update(cleaned);
  const snap = await ref.get();
  return { id: snap.id, ...snap.data() };
}

async function deleteTask(boardId, cardId, taskId) {
  await db.collection(BOARDS).doc(boardId).collection("cards").doc(cardId).collection("tasks").doc(taskId).delete();
  return true;
}

async function assignMember(boardId, cardId, taskId, memberId) {
  const ref = db.collection(BOARDS).doc(boardId).collection("cards").doc(cardId).collection("tasks").doc(taskId);
  await ref.update({ assigned: admin.firestore.FieldValue.arrayUnion(memberId), updatedAt: admin.firestore.FieldValue.serverTimestamp() });
  const snap = await ref.get();
  return { id: snap.id, ...snap.data() };
}

async function removeAssign(boardId, cardId, taskId, memberId) {
  const ref = db.collection(BOARDS).doc(boardId).collection("cards").doc(cardId).collection("tasks").doc(taskId);
  await ref.update({ assigned: admin.firestore.FieldValue.arrayRemove(memberId), updatedAt: admin.firestore.FieldValue.serverTimestamp() });
  const snap = await ref.get();
  return { id: snap.id, ...snap.data() };
}

module.exports = {
  listTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
  assignMember,
  removeAssign,
};