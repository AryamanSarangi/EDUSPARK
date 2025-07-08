const express = require("express");
const router = express.Router();
const {
  addNewCourse,
  getAllCourses,
  getCourseDetailsByID,
  updateCourseByID,
} = require("../../controllers/instructor-controller/course-controller");

const upload = require("../../middleware/upload");

// Course CRUD routes
router.post("/add", addNewCourse);
router.get("/get", getAllCourses);
router.get("/get/details/:id", getCourseDetailsByID);
router.put("/update/:id", updateCourseByID);

// 🔽 New route to handle course image upload
router.post("/upload-image", upload.single("image"), (req, res) => {
  console.log("UPLOAD HIT");
  if (!req.file) {
    console.log("NO FILE");
    return res.status(400).json({ success: false, message: "No file uploaded" });
  }

  console.log("FILE UPLOADED:", req.file.filename);

  const imageUrl = `/uploads/${req.file.filename}`;
  res.status(200).json({ success: true, imageUrl });
});


module.exports = router;
