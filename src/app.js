require('dotenv').config();
const express = require('express');
const cookieParser = require("cookie-parser");

const connectDB = require("./config/database");
const User = require("./models/user");

const app = express();
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routers/auth");
const profileRouter = require("./routers/profile");
const requestRouter = require("./routers/request");
const userRouter = require("./routers/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

// get user
app.get("/user/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const users = await User.find({ _id: userId });
    if (users.length !== 0) {
      res.send(users);
    } else {
      res.status(400).send("User not found!");
    }
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).send({ message: "Invalid User ID format" });
    }
    res.status(500).send(err.message);
  }
});

// update user
app.patch("/user/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const { firstName, lastName, password, age, gender, photoUrl, about } = req.body;
    const user = await User.findOneAndUpdate({ _id: userId }, { firstName, lastName, password, age, gender, photoUrl, about }, { runValidators: true });
    if (user) {
      res.send("User updated successfully!");
    } else {
      res.send("User not found!");
    }
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).send({ message: "Invalid User ID format" });
    }
    res.status(500).send(err.message);
  }
});

// delete user
app.delete("/user/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedUser = await User.deleteOne({ _id: userId });
    if (deletedUser.deletedCount === 0) {
      res.send("User deleted successfully!");
    } else {
      res.status(400).send("User not found!");
    }
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).send({ message: "Invalid User ID format" });
    }
    res.status(500).send(err.message);
  }
});

// Error handling
app.use('/', (err, req, res, next) => {
  if (err) {
    res.status(500).send("Something went wrong!");
  }
});

connectDB().then(() => {
  console.log("Database connected successfully!");
  app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
  });
}).catch((err) => {
  console.log("Database connection is failed!!");
});