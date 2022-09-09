const express = require("express");
const router = express.Router();
const userControler = require("../controllers/users");
// Auth ROUTER
router.post("/signup", userControler.register);
router.post("/login", userControler.login);

module.exports = router;
