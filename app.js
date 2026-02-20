const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Chat = require("./models/user");
const methodOveride = require("method-override");
require("dotenv").config();

app.set("view engine", "ejs");
app.set(("views", path.join(__dirname, "views")));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOveride("_method"));
main()
  .then(() => {
    console.log("Database Connected");
  })
  .catch(err => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
}

app.listen(process.env.PORT, () => {
  console.log("app is working");
});

app.get("/chat", async (req, res) => {
  let data = await Chat.find({});
  res.render("home.ejs", { chats: data });
});
app.get("/chat/new", (req, res) => {
  res.render("newChat.ejs");
});

app.post("/chat/new", async (req, res) => {
  let data = await Chat.insertOne({ ...req.body, createdAt: new Date() });
  res.redirect("/chat");
});

app.get("/chat/:id/edit", async (req, res) => {
  let { id } = req.params;
  let chat = await Chat.findById(id);
  res.render("edit.ejs", { chat: chat });
});

app.patch("/chat/:id", async (req, res) => {
  let { id } = req.params;
  let { msg } = req.body;
  await Chat.findByIdAndUpdate(id, { msg: msg });
  res.redirect("/chat");
});

app.delete("/chat/:id/delete", async (req, res) => {
  let { id } = req.params;
  await Chat.findByIdAndDelete(id);
  res.redirect("/chat");
});
