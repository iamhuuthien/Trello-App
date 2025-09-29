const boardService = require("../services/boardService");

async function listBoards(req, res) {
  try {
    const ownerId = `user:${String(req.user.email).toLowerCase()}`;
    const boards = await boardService.findByOwner(ownerId);
    return res.json({ ok: true, boards });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "internal_error" });
  }
}

async function createBoard(req, res) {
  try {
    const ownerId = `user:${String(req.user.email).toLowerCase()}`;
    const payload = { ...req.body, ownerId };
    const b = await boardService.createBoard(payload);
    return res.status(201).json({ ok: true, board: b });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "internal_error" });
  }
}

async function getBoard(req, res) {
  try {
    const id = req.params.id;
    const r = await boardService.findById(id);
    if (!r) return res.status(404).json({ error: "not_found" });
    // only owner can fetch details in this design
    const owner = `user:${String(req.user.email).toLowerCase()}`;
    if (r.data.ownerId !== owner) return res.status(403).json({ error: "forbidden" });
    return res.json({ ok: true, board: { id, ...r.data } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "internal_error" });
  }
}

async function updateBoard(req, res) {
  try {
    const id = req.params.id;
    const r = await boardService.findById(id);
    if (!r) return res.status(404).json({ error: "not_found" });
    const owner = `user:${String(req.user.email).toLowerCase()}`;
    if (r.data.ownerId !== owner) return res.status(403).json({ error: "forbidden" });
    const updated = await boardService.updateBoard(id, req.body);
    return res.json({ ok: true, board: updated });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "internal_error" });
  }
}

async function deleteBoard(req, res) {
  try {
    const id = req.params.id;
    const r = await boardService.findById(id);
    if (!r) return res.status(404).json({ error: "not_found" });
    const owner = `user:${String(req.user.email).toLowerCase()}`;
    if (r.data.ownerId !== owner) return res.status(403).json({ error: "forbidden" });
    await boardService.deleteBoard(id);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "internal_error" });
  }
}

module.exports = {
  listBoards,
  createBoard,
  getBoard,
  updateBoard,
  deleteBoard,
};