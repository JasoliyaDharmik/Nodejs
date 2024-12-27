const validator = require('validator');

const validationSignUpData = (req) => {
  const { firstName, lastName, email, password, age } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Name is blank");
  }
  if (firstName.length < 2 || firstName.length > 50) {
    throw new Error("First name length should be between 2-50 char");
  }
  if (lastName.length < 2 || lastName.length > 50) {
    throw new Error("Last name length should be between 2-50 char");
  }
  if (!validator.isEmail(email)) {
    throw new Error("Invalid email address");
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error("Invalid password");
  }
}

module.exports = { validationSignUpData };