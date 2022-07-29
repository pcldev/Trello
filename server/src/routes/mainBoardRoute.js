const express = require("express");

const MainBoardController = require("./../controllers/mainBoardController");

const router = express.Router();

router
  .route("/")
  .get(MainBoardController.getAllMainBoard)
  .post(MainBoardController.createMainBoard)
  .patch(MainBoardController.updateMainBoard)
  .delete(MainBoardController.deleteMainBoard);

router
  .route("/updateboards")
  .patch(MainBoardController.updateBoardsInMainBoards);

router.route("/:id").get(MainBoardController.getMainBoard);

module.exports = router;
