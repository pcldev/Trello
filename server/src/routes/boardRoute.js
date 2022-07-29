const express = require("express");

const boardController = require("./../controllers/boardController");

const router = express.Router();
router
  .route("/")
  .get(boardController.getAllBoard)
  .post(boardController.createBoard)
  .patch(boardController.updateBoard)
  .delete(boardController.deleteBoard);

router.route("/updatetasks").patch(boardController.updateTasksInBoard);

router.route("/updatemany").patch(boardController.updateMany);

router.route("/:id").get(boardController.getBoard);

module.exports = router;
