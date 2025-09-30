const admin = require("firebase-admin");
const db = admin.firestore();

async function createInvite(inv) {
  const ref = await db.collection("invitations").add({
    ...inv,
    status: inv.status || "pending",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  const doc = await ref.get();
  return { id: ref.id, ...doc.data() };
}

async function getInvite(id) {
  const snap = await db.collection("invitations").doc(id).get();
  if (!snap.exists) return null;
  return { id: snap.id, ...snap.data() };
}

async function updateInvite(id, upd) {
  const ref = db.collection("invitations").doc(id);
  await ref.update({ ...upd, updatedAt: admin.firestore.FieldValue.serverTimestamp() });
  const snap = await ref.get();
  return { id: snap.id, ...snap.data() };
}

module.exports = {
  createInvite,
  getInvite,
  updateInvite,
};