const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, "a_secret_key_should_be_longer_then_this");
    next();
  } catch (error) {
    res.status(401).json({ message: "Secret Key Doesn't Match" });
  }
};
