const express = require('express');

const app = express();
const { authAdmin } = require("./middlewares/auth");

// Order's of route is matters
// routes also accept the regular expression

app.use('/admin', authAdmin);

app.use('/', (err, req, res, next) => {
  console.log("sdssfsdfs");
  if (err) {
    res.status(500).send("Something went wrong!");
  }
  next();
});

app.get('/admin/getAllUserData', (req, res,next) => {
  // throw new Error("not found!");
  // res.send("All user list data");
  next();
});

app.get('/admin/getAllUserData*', (req, res) => {
  console.log("sdfsdfjskldj")
  // throw new Error("not found!");
  res.send("All user list data with start");
});

app.get('/admin/deleteUser', (req, res) => {
  res.send("Delete use successfully");
});

// Error handling
app.use('/', (err, req, res, next) => {
  if (err) {
    res.status(500).send("Something went wrong!");
  }
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});