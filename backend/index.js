require("dotenv").config();
const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");

const app = express();
app.use(cors());
app.use(express.json());

const {
  FIREBASE_PROJECT_ID,
  FIREBASE_CLIENT_EMAIL,
  FIREBASE_PRIVATE_KEY,
  USE_FIRESTORE_EMULATOR,
  FIRESTORE_EMULATOR_HOST,
  FIREBASE_AUTH_EMULATOR_HOST
} = process.env;

if (USE_FIRESTORE_EMULATOR === "1") {
  process.env.FIRESTORE_EMULATOR_HOST = FIRESTORE_EMULATOR_HOST || "127.0.0.1:8080";
  process.env.FIREBASE_AUTH_EMULATOR_HOST = FIREBASE_AUTH_EMULATOR_HOST || "127.0.0.1:9099";
}

const rawKey = process.env.FIREBASE_PRIVATE_KEY || "";
const privateKey = rawKey.replace(/^"|"$/g, "").replace(/\\n/g, "\n");

try {
  if (!admin.apps.length) {
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      admin.initializeApp();
    } else {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: FIREBASE_PROJECT_ID,
          clientEmail: FIREBASE_CLIENT_EMAIL,
          privateKey,
        }),
      });
    }
  }
} catch (err) {
  // no logs per request
}

// Health check
app.get("/health", (req, res) => res.json({ ok: true }));

const authRouter = require("./routes/auth");
const boardsRouter = require("./routes/boards");

app.use("/auth", authRouter);
app.use("/boards", boardsRouter);

const PORT = process.env.PORT || 4001;
app.listen(PORT);