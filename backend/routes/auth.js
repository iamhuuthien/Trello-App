const express = require("express");
const admin = require("firebase-admin");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { body, validationResult } = require("express-validator");

const router = express.Router();
const db = admin.firestore();
const USERS = "users";
const JWT_SECRET = process.env.JWT_SECRET || "dev_jwt_secret";

// helper: create transporter (use SMTP if provided or Ethereal for dev)
async function getTransporter() {
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  const testAccount = await nodemailer.createTestAccount();
  return nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
}

function makeCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function emailToId(email) {
  return encodeURIComponent(email.toLowerCase());
}

// POST /auth/signup { email }
router.post(
  "/signup",
  body("email").isEmail(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email } = req.body;
    const id = emailToId(email);
    const code = makeCode();
    const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes

    try {
      const userRef = db.collection(USERS).doc(id);
      await userRef.set(
        {
          email,
          code,
          codeExpiresAt: expiresAt,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );

      const transporter = await getTransporter();
      const info = await transporter.sendMail({
        from: process.env.SMTP_FROM || "no-reply@example.com",
        to: email,
        subject: "Your sign-in code",
        text: `Your sign-in code: ${code} (expires in 15 minutes)`,
        html: `<p>Your sign-in code: <strong>${code}</strong> (expires in 15 minutes)</p>`,
      });

      const previewUrl = nodemailer.getTestMessageUrl(info) || null;
      return res.json({ ok: true, previewUrl });
    } catch (err) {
      console.error("signup error:", err);
      return res.status(500).json({ error: "internal_error" });
    }
  }
);

// POST /auth/signin { email, code }
router.post(
  "/signin",
  body("email").isEmail(),
  body("code").isLength({ min: 4, max: 8 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, code } = req.body;
    const id = emailToId(email);

    try {
      const snap = await db.collection(USERS).doc(id).get();
      if (!snap.exists) return res.status(400).json({ error: "no_code" });

      const data = snap.data();
      if (!data) return res.status(400).json({ error: "invalid_user" });
      if (data.code !== code) return res.status(400).json({ error: "wrong_code" });
      if (Date.now() > (data.codeExpiresAt || 0)) return res.status(400).json({ error: "code_expired" });

      // create user record if not present
      await db.collection(USERS).doc(id).set(
        {
          email,
          lastSignIn: admin.firestore.FieldValue.serverTimestamp(),
          code: admin.firestore.FieldValue.delete(),
          codeExpiresAt: admin.firestore.FieldValue.delete(),
        },
        { merge: true }
      );

      const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "7d" });
      return res.json({ ok: true, token });
    } catch (err) {
      console.error("signin error:", err);
      return res.status(500).json({ error: "internal_error" });
    }
  }
);

module.exports = router;