const mongoose = require("mongoose");

const mainBoardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Main board must have a name"],
  },
  boards: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Board",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
});

mainBoardSchema.pre(/^find/, function (next) {
  this.populate({
    path: "boards",
  });
  next();
});

const MainBoard = mongoose.model("MainBoard", mainBoardSchema);

module.exports = MainBoard;

users = [{ id: "phong", passwd: "", boards: ["b1"] }];

boards = [{ id: "b1", name: "Board 1", tasks: ["t1"] }];

tasks = [{ id: "t1", title: "Task 1" }];

const main = {
  id: "main",
  order: ["board2", "board1"],
  boards: [
    {
      id: "board1",
      order: ["task2", "task1"],
      tasks: [
        {
          id: "task1",
          title: "This is task1 title",
        },
        {
          id: "task2",
          title: "This is task2 title",
        },
      ], // this task will contain list id task, then use populate
    },
    {
      id: "board2",
      order: ["task2", "task1"],
      tasks: [
        {
          id: "task1",
          title: "This is task1 title",
        },
        {
          id: "task2",
          title: "This is task2 title",
        },
      ],
    },
  ],
};
