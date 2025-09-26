require("dotenv").config();
const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const authRouter = require("./routes/auth");
const boardsRouter = require("./routes/boards");

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Firebase Admin from env
const {
  FIREBASE_PROJECT_ID,
  FIREBASE_CLIENT_EMAIL,
  FIREBASE_PRIVATE_KEY,
} = process.env;

try {
  if (!admin.apps.length) {
    const privateKey =
      FIREBASE_PRIVATE_KEY && FIREBASE_PRIVATE_KEY.includes("\\n")
        ? FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
        : FIREBASE_PRIVATE_KEY;
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: FIREBASE_PROJECT_ID,
        clientEmail: FIREBASE_CLIENT_EMAIL,
        privateKey,
      }),
    });
    console.log("Firebase admin initialized");
  }
} catch (err) {
  console.warn("Firebase admin init failed:", err.message);
}

app.use("/auth", authRouter);
app.use("/boards", boardsRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});