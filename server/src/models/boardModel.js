const mongoose = require("mongoose");

const boardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A board must have a board name"],
  },
  tasks: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Task",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
});

boardSchema.pre(/^find/, function (next) {
  this.populate({
    path: "tasks",
  });
  next();
});

const Board = mongoose.model("Board", boardSchema);

module.exports = Board;
