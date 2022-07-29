const express = require("express");

const taskController = require("./../controllers/taskController");

const router = express.Router();

router
  .route("/")
  .get(taskController.getAllTasks)
  .post(taskController.createTask)
  .patch(taskController.updateTask)
  .delete(taskController.deleteTask);

router
  .route("/updatefalsecompleted")
  .patch(taskController.updateTaskWithFalseCompleted);

router.route("/:id").get(taskController.getTask);

module.exports = router;
