const MainBoard = require("../models/mainBoardModel");
const Board = require("./../models/boardModel");

exports.getAllBoard = async (req, res) => {
  try {
    const allBoards = await Board.find();

    res.status(200).json({
      status: "Success",
      data: allBoards,
    });
  } catch (err) {
    res.status(200).json({
      status: "fali",
      message: err,
    });
  }
};

exports.getBoard = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);

    res.status(200).json({
      status: "success",
      data: board,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }

  // const tour = tou
};

exports.createBoard = async (req, res) => {
  try {
    const newBoard = await Board.create(req.body);

    res.status(200).json({
      status: "success",
      data: newBoard,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.updateBoard = async (req, res) => {
  try {
    const board = await Board.findByIdAndUpdate(req.body.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "Success",
      data: board,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.updateMany = async (req, res) => {
  try {
    await Promise.all(
      [...req.body].map(async (ele) => {
        await Board.findByIdAndUpdate(ele.id, ele, {
          new: true,
          runValidators: true,
        });
      })
    );
    res.status(200).json({
      status: "Success",
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.updateTasksInBoard = async (req, res) => {
  try {
    const board = await Board.findByIdAndUpdate(req.body.id, {
      $push: {
        tasks: req.body.tasks,
      },
    });

    res.status(200).json({
      status: "Success",
      data: board,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.deleteBoard = async (req, res) => {
  try {
    await Board.findByIdAndDelete(req.body.id);

    // const mainBoard = await MainBoard.find({});
    // mainBoard = mainBoard.filter((b) => b.id !== req.body.id);
    // mainBoard.save();

    res.status(200).json({
      status: "Success",
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};
