const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (req, res, next) => {
  try {
    const request_token = req.headers.authorization.split(" ")[1];
    const token = jwt.verify(request_token, process.env.SECRET);
    const userId = token.userId;
    if (req.body.userId && req.body.userId !== userId) throw "Token invalid";
    req.user = userId;

    next();
  } catch {
    res.status(500).json({
      error: "Une erreur est survenue",
    });
  }
};
