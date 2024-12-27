require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const cookieParser = require("cookie-parser");

const connectDB = require("./config/database");
const User = require("./models/user");
const { validationSignUpData } = require("./utils/validation");
const { userAuth } = require("./middlewares/auth");

const app = express();
app.use(express.json());
app.use(cookieParser());

// Never trust on req.body

// signup
app.post('/signup', async (req, res) => {
  try {
    // validation of data
    validationSignUpData(req);

    const { firstName, lastName, email, password, age, gender, about } = req.body;

    // encrypt the password
    const hashPassword = await bcrypt.hash(password, 10);

    // create new instance of the user modal
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashPassword,
      age,
      gender,
      about
    });
    await user.save();
    res.send("User added successfully!");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// login
app.get("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid username or password!");
    }
    const match = await user.validatePassword(password);
    if (!match) {
      throw new Error("Invalid username or password!");
    }
    const token = await user.getJWT();
    res.cookie("token", token, { maxAge: 10 * 3600 * 1000 }); // 10 min
    res.send("User login successfully!");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// get profile
app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

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