const express = require("express");
const admin = require("firebase-admin");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const sgMail = require('@sendgrid/mail');
const { body, validationResult } = require("express-validator");

const router = express.Router();
const db = admin.firestore();
const USERS = "users";
const JWT_SECRET = process.env.JWT_SECRET || "dev_jwt_secret";

// send helper: use SendGrid if configured, otherwise Ethereal test account
async function sendMailDirect({ to, from, subject, text, html }) {
  if (process.env.SENDGRID_API_KEY) {
    if (!process.env.SMTP_FROM) {
      throw new Error('SENDGRID requires SMTP_FROM to be set to a verified sender email');
    }
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to,
      from: process.env.SMTP_FROM,
      subject,
      text,
      html,
    };
    const res = await sgMail.send(msg);
    return { provider: 'sendgrid', accepted: [to], response: res && res[0] ? res[0].headers : null };
  }

  // fallback: Ethereal (dev)
  const testAccount = await nodemailer.createTestAccount();
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: { user: testAccount.user, pass: testAccount.pass },
  });
  const info = await transporter.sendMail({ from: from || `no-reply@${process.env.FIREBASE_PROJECT_ID || 'local'}.local`, to, subject, text, html });
  const previewUrl = nodemailer.getTestMessageUrl ? nodemailer.getTestMessageUrl(info) : null;
  return { provider: 'ethereal', accepted: info.accepted || [], response: info, previewUrl };
}

function makeCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function emailToId(email) {
  // Use the same id format as seed: "user:email@example.com"
  return `user:${String(email).toLowerCase()}`;
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

      try {
        const result = await sendMailDirect({
          to: email,
          from: process.env.SMTP_FROM || `no-reply@${process.env.FIREBASE_PROJECT_ID || 'local'}.local`,
          subject: "Your sign-in code",
          text: `Your sign-in code: ${code} (expires in 15 minutes)`,
          html: `<p>Your sign-in code: <strong>${code}</strong> (expires in 15 minutes)</p>`,
        });

        // return minimal info; include previewUrl only for ethereal dev
        return res.json({ ok: true, previewUrl: result.previewUrl || null });
      } catch (mailErr) {
        return res.status(502).json({ error: "mail_error", message: mailErr && mailErr.message ? mailErr.message : String(mailErr) });
      }
    } catch (err) {
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
      return res.status(500).json({ error: "internal_error" });
    }
  }
);

module.exports = router;