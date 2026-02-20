const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  studentId: String,
  courseId: String,
  amount: Number,
  currency: { type: String, default: "INR" },
  razorpayOrderId: String,
  razorpayPaymentId: String,
  status: { type: String, enum: ["pending", "completed", "failed"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Payment", PaymentSchema);
