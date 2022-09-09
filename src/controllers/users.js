const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

exports.login = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await User.findOne({ email }); // 500 Internal ERROR
    if (!user) throw new Error("User is undefined."); // 404 NOT FOUND

    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) throw new Error("Password is not the same."); // 404 NOT FOUND

    const token = jwt.sign({ userId: user._id }, process.env.SECRET, {
      expiresIn: "24h",
    });

    res.status(202).json({ userId: user._id, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Une erreur est survenue" });
  }
};

exports.register = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const hash = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hash });

    const newuser = await user.save();
    if (!newuser) throw new Error("User already exist or database is offline");

    res
      .status(201) // 201 CREATED
      .json({ message: "L'utilisateur a été crée avec succès." });
      
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: "Une erreur est survenue" }); // 400 BAD REQUEST
  }
};
