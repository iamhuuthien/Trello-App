const boardService = require("../services/boardService");
const cardService = require("../services/cardService");

async function listCards(req, res) {
  try {
    const boardId = req.params.boardId;
    const ok = await boardService.ensureAccess(boardId, req.user.email);
    if (ok.status !== 200) return res.status(ok.status).json(ok.body);
    const cards = await cardService.listCards(boardId);
    return res.json({ ok: true, cards });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "internal_error" });
  }
}

async function createCard(req, res) {
  try {
    const boardId = req.params.boardId;
    const ok = await boardService.ensureAccess(boardId, req.user.email);
    if (ok.status !== 200) return res.status(ok.status).json(ok.body);
    const { name, description, status, members, priority, deadline } = req.body;
    if (!name) return res.status(400).json({ error: "invalid_name" });
    const payload = { name, description, status, members, priority, deadline };
    const card = await cardService.createCard(boardId, payload);
    return res.status(201).json({ ok: true, card });
  } catch (err) {
    // improved logging for debugging
    console.error("createCard error:", err && err.stack ? err.stack : err);
    const message = (err && err.message) ? err.message : "internal_error";
    return res.status(500).json({ error: message });
  }
}

async function getCard(req, res) {
  try {
    const { boardId, id } = req.params;
    const ok = await boardService.ensureAccess(boardId, req.user.email);
    if (ok.status !== 200) return res.status(ok.status).json(ok.body);
    const card = await cardService.getCard(boardId, id);
    if (!card) return res.status(404).json({ error: "not_found" });
    return res.json({ ok: true, card });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "internal_error" });
  }
}

async function updateCard(req, res) {
  try {
    const { boardId, id } = req.params;
    const ok = await boardService.ensureAccess(boardId, req.user.email);
    if (ok.status !== 200) return res.status(ok.status).json(ok.body);
    const card = await cardService.getCard(boardId, id);
    if (!card) return res.status(404).json({ error: "not_found" });
    const upd = req.body;
    const updated = await cardService.updateCard(boardId, id, upd);
    return res.json({ ok: true, card: updated });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "internal_error" });
  }
}

async function deleteCard(req, res) {
  try {
    const { boardId, id } = req.params;
    const ok = await boardService.ensureAccess(boardId, req.user.email);
    if (ok.status !== 200) return res.status(ok.status).json(ok.body);
    const card = await cardService.getCard(boardId, id);
    if (!card) return res.status(404).json({ error: "not_found" });
    await cardService.deleteCard(boardId, id);
    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "internal_error" });
  }
}

async function listCardsByUser(req, res) {
  try {
    const { boardId, user_id } = req.params;
    const ok = await boardService.ensureAccess(boardId, req.user.email);
    if (ok.status !== 200) return res.status(ok.status).json(ok.body);
    const cards = await cardService.listCardsByUser(boardId, user_id);
    return res.json({ ok: true, cards });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "internal_error" });
  }
}

module.exports = {
  listCards,
  createCard,
  getCard,
  updateCard,
  deleteCard,
  listCardsByUser,
};