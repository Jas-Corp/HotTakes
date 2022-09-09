const multer = require("multer");

const types = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_");
    const extension = types[file.mimetype];
    callback(null, "image" + Date.now() + "." + extension);
  },
});

module.exports = multer({ storage: storage }).single("image");
