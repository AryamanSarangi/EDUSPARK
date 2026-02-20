const express = require("express");
const {
  generateCertificate,
} = require("../../controllers/student-controller/certificate-controller");

const router = express.Router();

router.get("/:courseId/:userId", generateCertificate);

module.exports = router;
