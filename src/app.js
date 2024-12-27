require('dotenv').config();
const express = require('express');
const connectDB = require("./config/database");
const User = require("./models/user");
const app = express();

app.use(express.json());

// signup api
app.post('/signup', async (req, res) => {
  try {
    const { firstName, lastName, email, password, age, gender, about } = req.body;
    const isExist = await User.find({ email });
    if (isExist.length !== 0) {
      throw new Error("User already exists!");
    } else {
      const user = new User({ firstName, lastName, email, password, age, gender, about });
      await user.save();
      res.send("User added successfully!");
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// get user by id
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

// delete user by email
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