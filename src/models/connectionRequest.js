const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
  fromUserId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  toUserId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ["ignored", "accepted", "rejected", "interested"],
    message: "{{VALUE}} is incorrect status type!"
  }
}, { timestamps: true });

// 1 for asc, -1 for desc
connectionRequestSchema.index({ firstName: 1 });

// This is call before saving data in database
// Don't use arrow function here
// connectionRequestSchema.pre("save", function (next) {
//   const connectionRequest = this;

//   // Check if the fromUserId is same as toUserId
//   if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
//     throw new Error("Cannot send connection request to yourself!");
//   }
//   next();
// });

const ConnectionRequestModal = new mongoose.model("ConnectionRequest", connectionRequestSchema);
module.exports = ConnectionRequestModal;