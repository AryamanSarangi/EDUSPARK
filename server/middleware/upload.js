const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Always save inside server/uploads
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: function (req, file, cb) {
    // unique filename: timestamp + original extension
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

module.exports = upload;
