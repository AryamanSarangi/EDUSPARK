const express = require("express");
const { enrollCourse } = require("../../controllers/student-controller/enroll-controller");

const router = express.Router();

router.post("/enroll", enrollCourse);

module.exports = router;
