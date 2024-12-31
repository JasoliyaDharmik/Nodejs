const express = require('express');
const bcrypt = require('bcrypt');
const authRouter = express.Router();

const { userAuth } = require('../middlewares/auth');
const User = require("../models/user");
const { validationSignUpData } = require("../utils/validation");

// Never trust on req.body
// signup
authRouter.post('/signup', async (req, res) => {
  try {
    // validation of data
    validationSignUpData(req);

    const { firstName, lastName, email, password, age, photoUrl, gender, about } = req.body;

    // encrypt the password
    const hashPassword = await bcrypt.hash(password, 10);

    // create new instance of the user modal
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashPassword,
      age,
      photoUrl,
      gender,
      about
    });
    await user.save();
    res.send({ message: "User created successfully!" });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).send({ error: "Email is already exist!" });
    }
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((err) => err.message);
      return res.status(400).send({ errors: messages });
    }
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// login
authRouter.get("/login", async (req, res) => {
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
    res.send({ message: "User login successfully!" });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// logout
authRouter.post("/logout", (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send({ message: "User logout successfully!" });
});

// forgot password
authRouter.post("/forgot-password", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const newPassword = req.body.newPassword;
    const newHashPassword = await bcrypt.hash(newPassword, 10);
    user.password = newHashPassword;
    user.save();
    res.send({ message: "Password update successfully!" });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

module.exports = authRouter;