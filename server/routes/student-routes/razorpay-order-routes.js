const express = require("express");
const {
  createRazorpayOrder,
  verifyRazorpayPayment,
} = require("../../controllers/student-controller/razorpay-order-controller");

const router = express.Router();

router.post("/create", createRazorpayOrder);
router.post("/verify", verifyRazorpayPayment);

module.exports = router;
