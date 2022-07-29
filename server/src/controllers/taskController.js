const Task = require("./../models/taskModel");

exports.getAllTasks = async (req, res) => {
  try {
    const allTasks = await Task.find();

    res.status(200).json({
      status: "Success",
      data: allTasks,
    });
  } catch (err) {
    res.status(200).json({
      status: "fali",
      message: err,
    });
  }
};

exports.getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    res.status(200).json({
      status: "success",
      data: task,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }

  // const tour = tou
};

exports.createTask = async (req, res) => {
  try {
    const newTask = await Task.create(req.body);

    res.status(200).json({
      status: "success",
      data: newTask,
    });
  } catch (err) {
    res.status(400).json({
      status: "Fail",
      message: err,
    });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.body.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "Success",
      data: task,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.updateTaskWithFalseCompleted = async (req, res) => {
  try {
    const task = await Task.updateMany({ completed: false });
    res.status(200).json({
      status: "Success",
      data: task,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.body.id);

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
