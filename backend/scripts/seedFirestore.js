const admin = require('firebase-admin');
const fs = require('fs');
require('dotenv').config();

if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  // uses file path
  admin.initializeApp();
} else {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey,
    }),
  });
}

const db = admin.firestore();

async function seed() {
  // users
  const users = [
    { id: 'user:alice@example.com', email: 'alice@example.com', name: 'Alice', createdAt: admin.firestore.FieldValue.serverTimestamp() },
    { id: 'user:bob@example.com', email: 'bob@example.com', name: 'Bob', createdAt: admin.firestore.FieldValue.serverTimestamp() },
  ];
  for (const u of users) {
    await db.collection('users').doc(u.id).set(u, { merge: true });
  }

  // board
  const boardRef = db.collection('boards').doc('board-demo-1');
  await boardRef.set({
    name: 'Demo Board',
    description: 'Board seeded for development',
    ownerId: 'user:alice@example.com',
    members: ['user:alice@example.com', 'user:bob@example.com'],
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  // card in board
  const cardRef = boardRef.collection('cards').doc('card-1');
  await cardRef.set({
    name: 'Card 1',
    description: 'First card',
    status: 'todo',
    members: ['user:alice@example.com'],
    priority: 'medium',
    deadline: null,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  // task under card
  await cardRef.collection('tasks').doc('task-1').set({
    title: 'Task A',
    description: 'Subtask example',
    status: 'open',
    ownerId: 'user:alice@example.com',
    assigned: ['user:bob@example.com'],
    attachments: [],
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  // invitation
  await db.collection('invitations').doc('inv-1').set({
    boardId: 'board-demo-1',
    inviteFrom: 'user:alice@example.com',
    inviteToEmail: 'charlie@example.com',
    status: 'pending',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  // githubAttachment
  await db.collection('githubAttachments').doc('gh-1').set({
    taskId: 'task-1',
    type: 'pull_request',
    numberOrSha: '42',
    repoFullName: 'owner/repo',
    meta: { title: 'Fix bug' },
    addedBy: 'user:alice@example.com',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  console.log('Seeding complete');
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});