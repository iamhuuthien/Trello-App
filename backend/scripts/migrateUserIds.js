const admin = require('firebase-admin');
require('dotenv').config();

function initAdmin() {
  if (admin.apps.length) return;
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    admin.initializeApp();
    return;
  }
  const privateKey = (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n');
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey,
    }),
  });
}

function isEncodedEmailId(id) {
  return id.includes('%40') && !id.startsWith('user:');
}

function toUserIdFromEncoded(id) {
  const email = decodeURIComponent(id).toLowerCase();
  return `user:${email}`;
}

async function replaceInArray(arr = [], oldId, newId) {
  if (!Array.isArray(arr)) return arr;
  return arr.map(v => (v === oldId ? newId : v));
}

async function updateDocRefs(db, docRef, oldId, newId) {
  const snap = await docRef.get();
  if (!snap.exists) return;
  const data = snap.data();
  let changed = false;
  const update = {};

  for (const [k, v] of Object.entries(data)) {
    if (typeof v === 'string' && v === oldId) {
      update[k] = newId;
      changed = true;
    } else if (Array.isArray(v) && v.includes(oldId)) {
      update[k] = v.map(x => (x === oldId ? newId : x));
      changed = true;
    }
  }

  if (changed) {
    await docRef.update(update);
  }
}

async function migrateBoardSubcollections(db, boardDocRef, oldId, newId) {
  // cards
  const cardsSnap = await boardDocRef.collection('cards').get();
  for (const cardDoc of cardsSnap.docs) {
    await updateDocRefs(db, cardDoc.ref, oldId, newId);
    // tasks under card
    const tasksSnap = await cardDoc.ref.collection('tasks').get();
    for (const taskDoc of tasksSnap.docs) {
      await updateDocRefs(db, taskDoc.ref, oldId, newId);
    }
  }
}

async function updateReferencesAcrossCollections(db, oldId, newId) {
  // boards: ownerId, members
  const boardsByOwner = await db.collection('boards').where('ownerId', '==', oldId).get();
  for (const b of boardsByOwner.docs) {
    await b.ref.update({ ownerId: newId });
  }

  const allBoards = await db.collection('boards').get();
  for (const b of allBoards.docs) {
    const data = b.data();
    let changed = false;
    const upd = {};
    if (Array.isArray(data.members) && data.members.includes(oldId)) {
      upd.members = data.members.map(x => (x === oldId ? newId : x));
      changed = true;
    }
    if (changed) await b.ref.update(upd);
    // subcollections
    await migrateBoardSubcollections(db, b.ref, oldId, newId);
  }

  // invitations: inviteFrom
  const invSnap = await db.collection('invitations').where('inviteFrom', '==', oldId).get();
  for (const d of invSnap.docs) await d.ref.update({ inviteFrom: newId });

  // githubAttachments: addedBy
  const ghSnap = await db.collection('githubAttachments').where('addedBy', '==', oldId).get();
  for (const d of ghSnap.docs) await d.ref.update({ addedBy: newId });

  // Also scan other top-level collections generically and replace string/array refs where present
  const collectionsToScan = ['boards', 'invitations', 'githubAttachments', 'users'];
  for (const col of collectionsToScan) {
    const snap = await db.collection(col).get();
    for (const doc of snap.docs) {
      await updateDocRefs(db, doc.ref, oldId, newId);
    }
  }
}

async function migrate() {
  initAdmin();
  const db = admin.firestore();

  console.log('Starting migration. Make sure you have a backup.');

  const usersSnap = await db.collection('users').get();
  for (const u of usersSnap.docs) {
    const id = u.id;
    if (!isEncodedEmailId(id)) continue;
    const newId = toUserIdFromEncoded(id);
    const data = u.data();

    // Move data to new doc (merge if exists)
    await db.collection('users').doc(newId).set({ ...data, id: newId }, { merge: true });

    // Update references across DB
    await updateReferencesAcrossCollections(db, id, newId);

    // Delete old doc
    await db.collection('users').doc(id).delete();

    console.log(`Migrated user ${id} -> ${newId}`);
  }

  console.log('Migration complete.');
  process.exit(0);
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});