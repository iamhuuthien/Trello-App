const boardService = require("../services/boardService");
const taskService = require("../services/taskService");
const cardService = require("../services/cardService");

async function listTasks(req, res) {
  try {
    const { boardId, cardId } = req.params;
    const ok = await boardService.ensureAccess(boardId, req.user.email);
    if (ok.status !== 200) return res.status(ok.status).json(ok.body);
    const tasks = await taskService.listTasks(boardId, cardId);
    return res.json({ ok: true, tasks });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "internal_error" });
  }
}

async function createTask(req, res) {
  try {
    const { boardId, cardId } = req.params;
    const ok = await boardService.ensureAccess(boardId, req.user.email);
    if (ok.status !== 200) return res.status(ok.status).json(ok.body);
    const card = await cardService.getCard(boardId, cardId);
    if (!card) return res.status(404).json({ error: "card_not_found" });
    const { title, description, status, ownerId, assigned } = req.body;
    if (!title) return res.status(400).json({ error: "invalid_title" });
    const payload = { title, description, status, ownerId, assigned };
    const task = await taskService.createTask(boardId, cardId, payload);
    return res.status(201).json({ ok: true, task });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "internal_error" });
  }
}

async function getTask(req, res) {
  try {
    const { boardId, cardId, taskId } = req.params;
    const ok = await boardService.ensureAccess(boardId, req.user.email);
    if (ok.status !== 200) return res.status(ok.status).json(ok.body);
    const task = await taskService.getTask(boardId, cardId, taskId);
    if (!task) return res.status(404).json({ error: "not_found" });
    return res.json({ ok: true, task });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "internal_error" });
  }
}

async function updateTask(req, res) {
  try {
    const { boardId, cardId, taskId } = req.params;
    const ok = await boardService.ensureAccess(boardId, req.user.email);
    if (ok.status !== 200) return res.status(ok.status).json(ok.body);
    const t = await taskService.getTask(boardId, cardId, taskId);
    if (!t) return res.status(404).json({ error: "not_found" });
    const updated = await taskService.updateTask(boardId, cardId, taskId, req.body);
    return res.json({ ok: true, task: updated });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "internal_error" });
  }
}

async function deleteTask(req, res) {
  try {
    const { boardId, cardId, taskId } = req.params;
    const ok = await boardService.ensureAccess(boardId, req.user.email);
    if (ok.status !== 200) return res.status(ok.status).json(ok.body);
    await taskService.deleteTask(boardId, cardId, taskId);
    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "internal_error" });
  }
}

async function assign(req, res) {
  try {
    const { boardId, cardId, taskId } = req.params;
    const { userId, email } = req.body;
    const member = userId || email;
    if (!member) return res.status(400).json({ error: "invalid_user" });
    const ok = await boardService.ensureAccess(boardId, req.user.email);
    if (ok.status !== 200) return res.status(ok.status).json(ok.body);
    const updated = await taskService.assignMember(boardId, cardId, taskId, member);
    return res.status(200).json({ ok: true, task: updated });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "internal_error" });
  }
}

async function removeAssign(req, res) {
  try {
    const { boardId, cardId, taskId } = req.params;
    const { userId, email } = req.body;
    const member = userId || email;
    if (!member) return res.status(400).json({ error: "invalid_user" });
    const ok = await boardService.ensureAccess(boardId, req.user.email);
    if (ok.status !== 200) return res.status(ok.status).json(ok.body);
    const updated = await taskService.removeAssign(boardId, cardId, taskId, member);
    return res.status(200).json({ ok: true, task: updated });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "internal_error" });
  }
}

module.exports = {
  listTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
  assign,
  removeAssign,
};