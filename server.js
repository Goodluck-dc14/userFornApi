require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const port = 4000;
const app = express();
const path = require("./Router");
const directory = require("./LandingPage");
const cors = require("cors");
app.use(express.json());
// MONGODB_URI =
//   "mongodb+srv://t62xbdtv8YyUmtj3:t62xbdtv8YyUmtj3@cluster0.zqyac.mongodb.net/MealDB?retryWrites=true&w=majority";

mongoose.connect(`${process.env.MONGODB_URI}`, {
  useNewUrlParser: true,
});
mongoose.connection
  .on("open", (req, res) => {
    console.log("Database is connected successfully");
  })
  .once("error", (req, res) => {
    console.log("failed to connect to database");
  });

app.get("/", async (req, res) => {
  res.send("building a login form");
});

app.use(cors());

app.use("/userForm", path);
app.use("/api/home", directory);

app.listen(port, () => {
  console.log(`server is listening on port: ${port}`);
});
