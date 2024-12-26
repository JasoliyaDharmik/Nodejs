const authAdmin = (req, res, next) => {
  const token = "xyz";
  const isAuthenticated = token === "xyz";
  if (!isAuthenticated) {
    res.send("You are not authenticated");
  } else {
    next();
  }
}

module.exports = { authAdmin };