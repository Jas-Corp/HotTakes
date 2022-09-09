const express = require("express");
const router = express.Router();
const isAuth = require("../middlewares/isAuth");
const sauceController = require("../controllers/sauces");
const multerConverter = require("../middlewares/multer");

router.get("/", isAuth, sauceController.getSauces);
router.get("/:id", isAuth, sauceController.getSauceById);
router.post("/:id/like", isAuth, sauceController.likeDislikeSauce);
router.post("/", isAuth, multerConverter, sauceController.createSauce);
router.put("/:id", isAuth, multerConverter, sauceController.updateSauce);
router.delete("/:id", isAuth, sauceController.deleteSauce);

module.exports = router;
