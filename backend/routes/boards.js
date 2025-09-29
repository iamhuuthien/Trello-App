const express = require("express");
const { body } = require("express-validator");
const auth = require("../middleware/auth");

const boardsCtrl = require("../controllers/boardsController");
const cardsCtrl = require("../controllers/cardsController");
const tasksCtrl = require("../controllers/tasksController");
const invitesCtrl = require("../controllers/inviteController");

const router = express.Router();

// Boards
router.get("/", auth, boardsCtrl.listBoards);
router.post("/", auth, body("title").isString().notEmpty(), boardsCtrl.createBoard);
router.get("/:id", auth, boardsCtrl.getBoard);
router.put("/:id", auth, boardsCtrl.updateBoard);
router.delete("/:id", auth, boardsCtrl.deleteBoard);

// Cards
router.get("/:boardId/cards", auth, cardsCtrl.listCards);
router.post("/:boardId/cards", auth, cardsCtrl.createCard);
router.get("/:boardId/cards/:id", auth, cardsCtrl.getCard);
router.put("/:boardId/cards/:id", auth, cardsCtrl.updateCard);
router.delete("/:boardId/cards/:id", auth, cardsCtrl.deleteCard);
router.get("/:boardId/cards/user/:user_id", auth, cardsCtrl.listCardsByUser);

// Tasks
router.get("/:boardId/cards/:cardId/tasks", auth, tasksCtrl.listTasks);
router.post("/:boardId/cards/:cardId/tasks", auth, tasksCtrl.createTask);
router.get("/:boardId/cards/:cardId/tasks/:taskId", auth, tasksCtrl.getTask);
router.put("/:boardId/cards/:cardId/tasks/:taskId", auth, tasksCtrl.updateTask);
router.delete("/:boardId/cards/:cardId/tasks/:taskId", auth, tasksCtrl.deleteTask);

// Assign/unassign
router.post("/:boardId/cards/:cardId/tasks/:taskId/assign", auth, tasksCtrl.assign);
router.delete("/:boardId/cards/:cardId/tasks/:taskId/assign", auth, tasksCtrl.removeAssign);

// Invites
router.post("/:boardId/invite", auth, invitesCtrl.createInvite);
router.post("/:boardId/cards/:cardId/invite/accept", auth, invitesCtrl.acceptInviteForCard);

module.exports = router;