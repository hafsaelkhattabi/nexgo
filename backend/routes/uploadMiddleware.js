// backend/routes/uploadMiddleware.js
const multer = require("multer");
const path = require("path");

// Multer Storage Config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// File Filter
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf" || file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only PDFs and images are allowed."), false);
  }
};

// Middleware to handle image and menu upload
const upload = multer({ storage, fileFilter }).fields([
  { name: "image", maxCount: 1 },
  { name: "menu", maxCount: 1 }
]);

module.exports = upload;
