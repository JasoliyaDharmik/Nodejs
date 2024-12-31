const express = require('express');
const profileRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");

// get profile
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send({ data: user });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// update profile
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    const user = req.user;
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid edit request!");
    }
    Object.keys(req.body).forEach(field => user[field] = req.body[field]);
    await user.save();
    res.send({ message: "Profile updated successfully!" });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

module.exports = profileRouter;