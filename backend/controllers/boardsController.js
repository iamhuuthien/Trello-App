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
    const boardRecord = await boardService.findById(id);
    if (!boardRecord) return res.status(404).json({ ok: false, message: "Board not found" });

    // boardRecord currently = { ref, data }
    const data = boardRecord.data || {};
    const boardId = boardRecord.ref && boardRecord.ref.id ? boardRecord.ref.id : id;

    // ensure columns exist (use normalized data columns or default)
    const columns = data.columns && data.columns.length ? data.columns : boardService.DEFAULT_COLUMNS;
    const out = { id: boardId, ...data, columns };

    return res.json({ ok: true, board: out });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, message: err.message });
  }
}

async function updateBoardHandler(req, res) {
  try {
    const id = req.params.id;
    const payload = req.body || {};
    const updated = await boardService.updateBoard(id, payload);
    const out = { ...updated, columns: updated.columns && updated.columns.length ? updated.columns : boardService.DEFAULT_COLUMNS };
    return res.json({ ok: true, board: out });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, message: err.message });
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

// Add column controller
async function addColumn(req, res) {
  try {
    const boardId = req.params.id;
    const { title, id: colId } = req.body || {};
    if (!title || String(title).trim() === "") return res.status(400).json({ error: "invalid_title" });

    // check board exists
    const r = await boardService.findById(boardId);
    if (!r) return res.status(404).json({ error: "not_found" });

    // only owner allowed (or you can relax)
    const owner = `user:${String(req.user.email).toLowerCase()}`;
    if (r.data.ownerId !== owner) return res.status(403).json({ error: "forbidden" });

    // build new column id (slug-like) if not provided
    const slugify = (s) =>
      String(s || "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") || `col-${Date.now()}`;

    const newCol = { id: colId || slugify(title), title: title.trim() };

    const existingCols = Array.isArray(r.data.columns) ? r.data.columns : boardService.DEFAULT_COLUMNS.slice();
    existingCols.push(newCol);

    const updated = await boardService.updateBoard(boardId, { columns: existingCols });
    const out = { ...updated, columns: updated.columns && updated.columns.length ? updated.columns : boardService.DEFAULT_COLUMNS };
    return res.status(201).json({ ok: true, board: out });
  } catch (err) {
    console.error("addColumn error:", err);
    return res.status(500).json({ error: "internal_error" });
  }
}

module.exports = {
  listBoards,
  createBoard,
  getBoard,
  updateBoard: updateBoardHandler,
  deleteBoard,
  addColumn,
};