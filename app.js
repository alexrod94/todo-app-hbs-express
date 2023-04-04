const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const hbs = require("hbs");

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/todo-app")
  .then((x) => console.log("Connection working"));

const Todo = mongoose.model("Todo", {
  title: String,
  completed: Boolean,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
app.set("views", __dirname + "/views");
app.set("view engine", "hbs");
hbs.registerPartials(__dirname + "/views/partials");

// read
app.get("/", async (req, res) => {
  try {
    const todos = await Todo.find();
    res.render("home", { todos });
  } catch (err) {
    res.send(err);
  }
});

app.get("/create-todo", (req, res) => {
  res.render("create-todo");
});

// create
app.post("/todos", async (req, res) => {
  const newTodo = {
    title: req.body.title,
    completed: req.body.completed === "true" ? true : false,
  };
  await Todo.create(newTodo);
  res.render("completed");
});

//update
app.get("/update-todo/:id", async (req, res) => {
  const currentTodo = await Todo.find({ _id: req.params.id });
  res.render("update-todo", { todo: currentTodo[0] });
});

app.post("/todos/update/:id", async (req, res) => {
  const id = req.params.id;
  const newTodo = req.body;
  await Todo.findByIdAndUpdate(id, newTodo);
  res.render("completed");
});

//delete
app.get("/todos/delete/:id", async (req, res) => {
  const id = req.params.id;
  const todo = await Todo.findByIdAndDelete(id);
  res.render("completed");
});

app.listen(3000, () => {
  console.log("Server listening...");
});
