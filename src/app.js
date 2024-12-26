require('dotenv').config();
const express = require('express');
const connectDB = require("./config/database");
const User = require("./models/user");
const app = express();

app.use(express.json());

// signup api
app.post('/signup', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.send("User added successfully!");
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

// get user by id
app.get("/user", async (req, res) => {
  try {
    const users = await User.find({ email: req.body.email });
    if (users.length !== 0) {
      res.send(users);
    } else {
      res.status(400).send("User not found!");
    }
  } catch (err) {
    res.status(500).send("Something went wrong!");
  }
});

// update user
app.patch("/user", async (req, res) => {
  try {
    const { firstName, lastName, password } = req.body;
    const user = await User.findOneAndUpdate({ email: req.body.email }, { firstName, lastName, password });
    if (user) {
      res.send("User updated successfully!");
    } else {
      res.send("User not found!");
    }
  } catch (err) {
    res.status(500).send("Something went wrong!");
  }
});

// delete user by email
app.delete("/user", async (req, res) => {
  try {
    const deletedUser = await User.deleteOne({ email: req.body.email });
    if (deletedUser.deletedCount === 0) {
      res.send("User deleted successfully!");
    } else {
      res.status(400).send("User not found!");
    }
  } catch (err) {
    res.status(500).send("Something went wrong!");
  }
});

// Error handling
app.use('/', (err, req, res) => {
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