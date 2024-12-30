const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");

// interest or ignore new connection
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
      data,
      message: status
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// accept or reject connection request
requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { status, requestId } = req.params;

    // check status is correct
    const allowedStatus = ["accepted", "rejected"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Status not allowed!" });
    }

    // that connection request need to present in database
    const connectionRequestData = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: loggedInUser._id,
      status: "interested"
    });
    if (!connectionRequestData) {
      return res.status(400).json({ message: "Connection request not found!" });
    }
    connectionRequestData.status = status;
    connectionRequestData.save();
    res.send({
      message: "Connection request is " + status,
      data: connectionRequestData
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = requestRouter;