const Sauce = require("../models/Sauce");
const fs = require("fs");

exports.getSauces = (req, res) => {
  try {
    Sauce.find().then((sauce) => {
      res.send(sauce);
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ error });
  }
};

exports.getSauceById = (req, res) => {
  const _id = req.params.id;
  Sauce.findOne({ _id })
    .then((sauce) => res.status(202).json(sauce)) // ACEPTED
    .catch((error) => {
      console.error(error);
      res.status(404).json({ error: "Une erreur est survenue." });
    });
};

exports.createSauce = (req, res, next) => {
  const request_sauce = JSON.parse(req.body.sauce);
  const sauce = new Sauce({
    ...request_sauce,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
    likes: 0,
    dislikes: 0,
    usersLiked: [" "],
    usersdisLiked: [" "],
  });
  try {
    sauce.save();
    res.status(201).json({ message: "La sauce a bien été crée" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Une erreur est survenue." });
  }
};

exports.likeDislikeSauce = (req, res) => {
  const sauceId = req.params.id;
  const userId = req.body.userId;
  const like = req.body.like;

  if (like < -1 || like > 1) {
    res.status(400).json({ error: "Une erreur est survenue." });
    return;
  }

  try {
    if (like === 0) {
      Sauce.findOne({ _id: sauceId }).then((sauce) => {
        if (sauce.usersLiked.includes(userId))
          Sauce.updateOne(
            { _id: sauceId },
            { $pull: { usersLiked: userId }, $inc: { likes: -1 } }
          ).then((res) => {
            console.log(res);
          });
        else if (sauce.usersDisliked.includes(userId))
          Sauce.updateOne(
            { _id: sauceId },
            { $pull: { usersDisliked: userId }, $inc: { dislikes: -1 } }
          ).then((res) => {
            console.log(res);
          });

        res.status(202).json({ message: `Vous avez retirez votre avis` });
      });
      return;
    }

    Sauce.updateOne(
      { _id: sauceId },
      like === 1
        ? { $push: { usersLiked: userId }, $inc: { likes: +1 } }
        : { $push: { usersDisliked: userId }, $inc: { dislikes: +1 } }
    ).then((res) => {
      console.log(res);
    });

    res.status(202).json({
      message:
        like === 1
          ? `Vous avez aimez la sauce.`
          : `Vous n'aimez pas cette sauce.`,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Une erreur est survenue." });
  }
};
exports.deleteSauce = (req, res) => {
  const _id = req.params.id;
  try {
    Sauce.findOne({ _id }).then((sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id }).then(
          res.status(202).json({ message: "La sauce a bien été supprimé" })
        );
      });
    });
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: "Une erreur est survenue." });
  }
};

exports.updateSauce = (req, res) => {
  const _id = req.params.id;
  const request_sauce = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  try {
    Sauce.updateOne({ _id }, { ...request_sauce, _id }).then((res) => {
      res.status(202).json({ message: "Sauce modifiée" });
    });
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: "Une erreur est survenue." });
  }
};
