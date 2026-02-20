const express = require("express");
const {
  getCoursesByStudentId,
  dropCourse,
} = require("../../controllers/student-controller/student-courses-controller");

const router = express.Router();

router.get("/get/:studentId", getCoursesByStudentId);
router.delete("/drop/:studentId/:courseId", dropCourse);

module.exports = router;
