const express = require("express");
const admin = require("firebase-admin");
const { body, validationResult } = require("express-validator");
const auth = require("../middleware/auth");

const router = express.Router();
const db = admin.firestore();
const BOARDS = "boards";

// GET /boards - list user's boards
router.get("/", auth, async (req, res) => {
  try {
    // use ownerId format matching users docs
    const ownerId = `user:${String(req.user.email).toLowerCase()}`;
    const q = db.collection(BOARDS).where("ownerId", "==", ownerId);
    const snap = await q.get();
    const boards = [];
    snap.forEach((d) => boards.push({ id: d.id, ...d.data() }));
    res.json({ ok: true, boards });
  } catch (err) {
    console.error("boards list error:", err);
    res.status(500).json({ error: "internal_error" });
  }
});

// POST /boards { title }
router.post(
  "/",
  auth,
  body("title").isString().notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const ownerId = `user:${String(req.user.email).toLowerCase()}`;
      const payload = {
        title: req.body.title,
        ownerId,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      };
      const ref = await db.collection(BOARDS).add(payload);
      const doc = await ref.get();
      res.status(201).json({ ok: true, board: { id: ref.id, ...doc.data() } });
    } catch (err) {
      console.error("create board error:", err);
      res.status(500).json({ error: "internal_error" });
    }
  }
);

// GET /boards/:id
router.get("/:id", auth, async (req, res) => {
  try {
    const id = req.params.id;
    const snap = await db.collection(BOARDS).doc(id).get();
    if (!snap.exists) return res.status(404).json({ error: "not_found" });
    const data = snap.data();
    const ownerId = `user:${String(req.user.email).toLowerCase()}`;
    if (data.ownerId !== ownerId) return res.status(403).json({ error: "forbidden" });
    res.json({ ok: true, board: { id: snap.id, ...data } });
  } catch (err) {
    console.error("get board error:", err);
    res.status(500).json({ error: "internal_error" });
  }
});

// PUT /boards/:id
router.put(
  "/:id",
  auth,
  body("title").optional().isString(),
  async (req, res) => {
    try {
      const id = req.params.id;
      const ref = db.collection(BOARDS).doc(id);
      const snap = await ref.get();
      if (!snap.exists) return res.status(404).json({ error: "not_found" });
      const data = snap.data();
      const ownerId = `user:${String(req.user.email).toLowerCase()}`;
      if (data.ownerId !== ownerId) return res.status(403).json({ error: "forbidden" });

      await ref.update({
        ...(req.body.title ? { title: req.body.title } : {}),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      const updated = await ref.get();
      res.json({ ok: true, board: { id: updated.id, ...updated.data() } });
    } catch (err) {
      console.error("update board error:", err);
      res.status(500).json({ error: "internal_error" });
    }
  }
);

// DELETE /boards/:id
router.delete("/:id", auth, async (req, res) => {
  try {
    const id = req.params.id;
    const ref = db.collection(BOARDS).doc(id);
    const snap = await ref.get();
    if (!snap.exists) return res.status(404).json({ error: "not_found" });
    const data = snap.data();
    const ownerId = `user:${String(req.user.email).toLowerCase()}`;
    if (data.ownerId !== ownerId) return res.status(403).json({ error: "forbidden" });

    await ref.delete();
    res.json({ ok: true });
  } catch (err) {
    console.error("delete board error:", err);
    res.status(500).json({ error: "internal_error" });
  }
});

module.exports = router;