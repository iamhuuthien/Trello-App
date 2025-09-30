const admin = require("firebase-admin");
const fs = require("fs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

function initAdmin() {
  if (admin.apps.length) return;
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    admin.initializeApp();
    return;
  }
  const privateKey = (process.env.FIREBASE_PRIVATE_KEY || "").replace(/\\n/g, "\n");
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey,
    }),
  });
}

initAdmin();
const db = admin.firestore();
const JWT_SECRET = process.env.JWT_SECRET || "dev_jwt_secret";

async function findUserDocByEmail(email) {
  const q = await db.collection("users").where("email", "==", email).limit(1).get();
  if (!q.empty) return q.docs[0];
  // try common id forms
  const encId = encodeURIComponent(email);
  const tryIds = [encId, `user:${email}`, email];
  for (const id of tryIds) {
    const doc = await db.collection("users").doc(id).get();
    if (doc.exists) return doc;
  }
  return null;
}

async function upsertUser(email, name) {
  const existing = await findUserDocByEmail(email);
  if (existing) {
    const id = existing.id;
    await existing.ref.set(
      {
        email,
        name,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
    return { id, ref: existing.ref };
  }
  const id = encodeURIComponent(email);
  const ref = db.collection("users").doc(id);
  await ref.set({
    email,
    name,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  return { id, ref };
}

async function upsertBoard(id, payload) {
  const ref = db.collection("boards").doc(id);
  await ref.set({ ...payload, createdAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
  return ref;
}

async function upsertCard(boardRef, cardId, payload) {
  const ref = boardRef.collection("cards").doc(cardId);
  await ref.set({ ...payload, createdAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
  return ref;
}

async function upsertTask(cardRef, taskId, payload) {
  const ref = cardRef.collection("tasks").doc(taskId);
  await ref.set({ ...payload, createdAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
  return ref;
}

async function createInvitation(id, payload) {
  const ref = db.collection("invitations").doc(id);
  await ref.set({ ...payload, createdAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
  return ref;
}

function createTokenForEmail(email, extra = {}) {
  const payload = { email, ...extra };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "30d" });
}

async function seed() {
  console.log("Seeding demo with two users and tokens...");

  // adjust these emails to match your Firestore users if needed
  const userAEmail = "nhuuthien000@gmail.com";
  const userBEmail = "huutan890ht@gmail.com";

  const userA = await upsertUser(userAEmail, "Nhuu Thien");
  const userB = await upsertUser(userBEmail, "Huu Tan");

  // Boards
  const board1Ref = await upsertBoard("board-seed-1", {
    title: "Demo Board - Seed 1",
    description: "Demo board owned by userA",
    ownerId: `user:${userAEmail}`,
    members: [`user:${userAEmail}`, `user:${userBEmail}`],
  });

  const board2Ref = await upsertBoard("board-seed-2", {
    title: "Demo Board - Seed 2",
    description: "Demo board owned by userB",
    ownerId: `user:${userBEmail}`,
    members: [`user:${userBEmail}`],
  });

  // Cards for board1
  const card1Ref = await upsertCard(board1Ref, "card-seed-1", {
    name: "Seed: Landing copy",
    description: "Write landing page copy",
    status: "todo",
    members: [`user:${userAEmail}`],
    priority: "high",
  });
  const card2Ref = await upsertCard(board1Ref, "card-seed-2", {
    name: "Seed: Auth email code",
    description: "Email code signin flow",
    status: "doing",
    members: [`user:${userBEmail}`],
    priority: "medium",
  });

  // Tasks
  await upsertTask(card1Ref, "task-seed-1", {
    title: "Draft hero headline",
    description: "3 variations",
    status: "open",
    ownerId: `user:${userAEmail}`,
    assigned: [`user:${userAEmail}`],
  });
  await upsertTask(card2Ref, "task-seed-2", {
    title: "Wire signin UI",
    description: "Include email + code step",
    status: "in_progress",
    ownerId: `user:${userBEmail}`,
    assigned: [`user:${userBEmail}`],
  });

  // Invitation example (pending invite to some external email)
  await createInvitation("inv-seed-1", {
    boardId: "board-seed-1",
    inviteFrom: `user:${userAEmail}`,
    inviteToEmail: "external@example.com",
    status: "pending",
  });

  // Create tokens for frontend use
  const tokenA = createTokenForEmail(userAEmail, { name: "Nhuu Thien" });
  const tokenB = createTokenForEmail(userBEmail, { name: "Huu Tan" });

  const out = {
    users: {
      userA: { email: userAEmail, docId: userA.id },
      userB: { email: userBEmail, docId: userB.id },
    },
    boards: ["board-seed-1", "board-seed-2"],
    tokens: { userA: tokenA, userB: tokenB },
  };

  // write tokens file for convenience
  fs.writeFileSync("seed_tokens.json", JSON.stringify(out, null, 2));
  console.log("Seed finished. Tokens written to seed_tokens.json");
  console.log("User A token (copy for frontend Authorization):\n", tokenA);
  console.log("User B token (copy for frontend Authorization):\n", tokenB);
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});