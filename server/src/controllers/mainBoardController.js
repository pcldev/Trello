const MainBoard = require("./../models/mainBoardModel");

exports.getAllMainBoard = async (req, res) => {
  try {
    const allMainBoards = await MainBoard.find();

    res.status(200).json({
      status: "Success",
      data: allMainBoards,
    });
  } catch (err) {
    res.status(200).json({
      status: "fali",
      message: err,
    });
  }
};

exports.getMainBoard = async (req, res) => {
  try {
    const mainBoard = await MainBoard.findById(req.params.id);

    res.status(200).json({
      status: "success",
      data: mainBoard,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }

  // const tour = tou
};

exports.createMainBoard = async (req, res) => {
  try {
    const mainBoard = await MainBoard.create(req.body);

    res.status(200).json({
      status: "success",
      data: mainBoard,
    });
  } catch (err) {
    res.status(400).json({
      status: "Fail",
      data: {
        tour: err,
      },
    });
  }
};

exports.updateMainBoard = async (req, res) => {
  try {
    const mainBoard = await MainBoard.findByIdAndUpdate(req.body.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "Success",
      data: mainBoard,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.updateBoardsInMainBoards = async (req, res) => {
  try {
    const mainBoard = await MainBoard.findByIdAndUpdate(req.body.id, {
      $push: {
        boards: req.body.boards,
      },
    });

    res.status(200).json({
      status: "Success",
      data: mainBoard,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.deleteMainBoard = async (req, res) => {
  try {
    await MainBoard.findByIdAndDelete(req.body.id);

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
