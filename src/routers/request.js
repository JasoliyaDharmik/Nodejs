const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const { status, toUserId } = req.params;
    // check status is correct
    const allowedStatus = ["ignored", "interested"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status type: " + status });
    }

    // check userId is correct or not
    const toUser = await User.findOne({ _id: toUserId });
    if (!toUser) {
      return res.status(400).json({ message: "User not found!" });
    }

    // toUserId not same as fromUserId
    if (toUser._id.equals(fromUserId)) {
      return res.status(400).json({ message: "Cannot send connection request to yourself!" });
    }

    // if one user send connection request then other user not able to send to first user again
    const existingConnectionRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId }
      ]
    });
    if (existingConnectionRequest) {
      return res.status(400).json({ message: "Connection request already exists!" });
    }
    const data = new ConnectionRequest({ fromUserId, toUserId, status });
    await data.save();
    res.status(200).json({
      message: status + " profile!",
      data
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = requestRouter;