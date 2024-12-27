const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  const cookies = req.cookies;
  const { token } = cookies;
  if (!token) {
    res.status(400).send("Invalid token!");
    return;
  }
  const decodedObj = jwt.verify(token, "Test@123");
  const { id } = decodedObj;
  const user = await User.find({ _id: id });
  if (!user) {
    res.status(400).send("User not found!");
    return;
  }
  req.user = user;
  next();
}

module.exports = { userAuth };