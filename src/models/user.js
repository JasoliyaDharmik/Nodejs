const mongoose = require("mongoose");
const validator = require('validator');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First name is required"],
    minLength: [2, "First name must be at least 2 characters"],
    maxLength: [50, "First name must not exceed 50 characters"],
  },
  lastName: {
    type: String,
    required: [true, "Last name is required"],
    minLength: [2, "Last name must be at least 2 characters"],
    maxLength: [50, "Last name must not exceed 50 characters"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
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
    required: [true, "Password is required"],
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

// Don't use arrow function here. Use normal function only
// because we need use this inside function
userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ id: user._id }, 'Test@123', { expiresIn: "7d" });
  return token;
}

userSchema.methods.validatePassword = async function (userAddedPassword) {
  const user = this;
  const isPasswordMatch = await bcrypt.compare(userAddedPassword, user.password);
  return isPasswordMatch;
}
module.exports = mongoose.model("User", userSchema);