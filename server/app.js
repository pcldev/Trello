const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const taskRouter = require("./src/routes/taskRoute");
const boardRouter = require("./src/routes/boardRoute");
const mainBoardRouter = require("./src/routes/mainBoardRoute");

const app = express();

app.use(cors());
dotenv.config({
  path: "./config.env",
});

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((con) => {
    console.log("DB connection successful");
  });

app.use(express.json());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// ROUTER
app.use("/tasks", taskRouter);
app.use("/boards", boardRouter);
app.use("/mainboards", mainBoardRouter);

module.exports = app;
