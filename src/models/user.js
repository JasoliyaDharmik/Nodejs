const mongoose = require("mongoose");
const validator = require('validator');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minLength: [2, "First name length must be 2-50 char allowed"],
    maxLength: [50, "Last name length must be 2-50 char allowed"],
  },
  lastName: {
    type: String,
    required: true,
    minLength: [2, "Last name length must be 2-50 char allowed"],
    maxLength: [50, "Last name length must be 2-50 char allowed"],
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid email address");
      }
    }
  },
  password: {
    type: String,
    required: true,
    validate: (value) => {
      return validator.isStrongPassword(value)
    }
  },
  age: {
    type: Number,
    min: [18, "Min age should be 18"]
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"]
  },
  photoUrl: {
    type: String,
    validate(value) {
      if (!validator.isURL(value)) {
        throw new Error("Invalid photo url");
      }
    }
  },
  about: {
    type: String,
    default: "This is default description"
  }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);