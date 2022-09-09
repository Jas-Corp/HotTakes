const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const sauceSchema = mongoose.Schema({
  name: { type: String, unique: true, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true },
  likes: { type: Number, required: true },
  dislikes: { type: Number, required: true },
  usersLiked: { type: [String], required: true },
  usersDisliked: { type: [String], required: true },
  userId: { type: String, required: true },
});
sauceSchema.plugin(uniqueValidator);
module.exports = mongoose.model("Sauce", sauceSchema);
