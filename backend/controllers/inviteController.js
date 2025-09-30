const boardService = require("../services/boardService");
const inviteService = require("../services/inviteService");

async function createInvite(req, res) {
  try {
    const boardId = req.params.boardId;
    const { inviteToEmail } = req.body;
    if (!inviteToEmail) return res.status(400).json({ error: "invalid_email" });

    const r = await boardService.findById(boardId);
    if (!r) return res.status(404).json({ error: "not_found" });
    const owner = `user:${String(req.user.email).toLowerCase()}`;
    if (r.data.ownerId !== owner) return res.status(403).json({ error: "forbidden" });

    const inv = await inviteService.createInvite({
      boardId,
      inviteFrom: owner,
      inviteToEmail: inviteToEmail.toLowerCase(),
      status: "pending",
    });
    return res.status(201).json({ ok: true, invitation: inv });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "internal_error" });
  }
}

async function acceptInviteForCard(req, res) {
  try {
    const { boardId, cardId } = req.params;
    const { invitationId } = req.body;
    if (!invitationId) return res.status(400).json({ error: "missing_invitation_id" });

    const inv = await inviteService.getInvite(invitationId);
    if (!inv) return res.status(404).json({ error: "invitation_not_found" });
    if (inv.boardId !== boardId) return res.status(400).json({ error: "board_mismatch" });
    if (inv.status !== "pending") return res.status(400).json({ error: "invalid_status" });

    const userEmail = String(req.user.email).toLowerCase();
    if (String(inv.inviteToEmail).toLowerCase() !== userEmail) return res.status(403).json({ error: "not_invited" });

    const userId = `user:${userEmail}`;
    // add member to board and card
    const boardRef = (await boardService.findById(boardId)).ref;
    await boardRef.update({ members: admin.firestore.FieldValue.arrayUnion(userId), updatedAt: admin.firestore.FieldValue.serverTimestamp() });

    const cardRef = boardRef.collection("cards").doc(cardId);
    const cardSnap = await cardRef.get();
    if (cardSnap.exists) {
      await cardRef.update({ members: admin.firestore.FieldValue.arrayUnion(userId), updatedAt: admin.firestore.FieldValue.serverTimestamp() });
    }

    await inviteService.updateInvite(invitationId, { status: "accepted", acceptedAt: admin.firestore.FieldValue.serverTimestamp() });

    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "internal_error" });
  }
}

module.exports = {
  createInvite,
  acceptInviteForCard,
};