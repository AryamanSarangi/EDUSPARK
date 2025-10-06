const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

// Configure multer to store in /uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // save in uploads folder
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// ✅ Upload single file (image/video/pdf)
router.post("/upload", upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    // Build absolute URL so frontend can access it regardless of origin
    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    return res.status(200).json({
      success: true,
      data: {
        url: fileUrl,
        filename: req.file.filename,
        public_id: req.file.filename,
      },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: "Error uploading file" });
  }
});

// ✅ Upload multiple files
router.post("/bulk-upload", upload.array("files"), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: "No files uploaded" });
    }

    const items = req.files.map((fileItem) => ({
      url: `${req.protocol}://${req.get("host")}/uploads/${fileItem.filename}`,
      filename: fileItem.filename,
      public_id: fileItem.filename,
    }));

    return res.status(200).json({ success: true, data: items });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: "Error uploading files" });
  }
});

// ✅ Delete a file by public_id (filename)
router.delete("/delete/:id", (req, res) => {
  try {
    const { id } = req.params;
    const targetPath = path.join(process.cwd(), "server", "uploads", id);

    // If file not found in server/uploads, also try project-root/uploads
    const fallbackPath = path.join(process.cwd(), "uploads", id);
    const filePath = fs.existsSync(targetPath) ? targetPath : fallbackPath;

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: "File not found" });
    }

    fs.unlinkSync(filePath);
    return res.status(200).json({ success: true, message: "File deleted" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: "Error deleting file" });
  }
});

module.exports = router;
