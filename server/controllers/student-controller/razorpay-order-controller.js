const Razorpay = require("razorpay");
const crypto = require("crypto");
const Course = require("../../models/Course");
const StudentCourses = require("../../models/StudentCourses");
const Payment = require("../../models/Payment");

function getRazorpayInstance() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    throw new Error("RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be set in .env");
  }
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
}

const createRazorpayOrder = async (req, res) => {
  try {
    const { courseId, studentId, userName, userEmail } = req.body;

    if (!courseId || !studentId) {
      return res.status(400).json({
        success: false,
        message: "courseId and studentId are required",
      });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const price = Number(course.pricing);
    if (isNaN(price) || price < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid course price",
      });
    }

    const amountInPaise = Math.round(price * 100);
    if (amountInPaise < 100) {
      return res.status(400).json({
        success: false,
        message: "Amount must be at least 1 INR",
      });
    }

    const receipt = `eduspark_${courseId}_${studentId}_${Date.now()}`.slice(0, 40);

    const razorpay = getRazorpayInstance();
    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt,
      notes: {
        courseId: String(courseId),
        studentId: String(studentId),
      },
    });

    const paymentRecord = new Payment({
      studentId,
      courseId,
      amount: price,
      currency: "INR",
      razorpayOrderId: order.id,
      status: "pending",
    });
    await paymentRecord.save();

    res.status(201).json({
      success: true,
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        key: process.env.RAZORPAY_KEY_ID,
        courseTitle: course.title,
        userName: userName || "",
        userEmail: userEmail || "",
      },
    });
  } catch (err) {
    console.error("Razorpay create order error:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Failed to create order",
    });
  }
};

const verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      studentId,
      userName,
      userEmail,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Missing payment verification data",
      });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return res.status(500).json({
        success: false,
        message: "Payment verification not configured",
      });
    }

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(sign)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    const payment = await Payment.findOne({
      razorpayOrderId: razorpay_order_id,
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment record not found",
      });
    }

    if (payment.status === "completed") {
      return res.status(200).json({
        success: true,
        message: "Payment already verified",
        data: { alreadyEnrolled: true },
      });
    }

    payment.razorpayPaymentId = razorpay_payment_id;
    payment.status = "completed";
    await payment.save();

    const course = await Course.findById(payment.courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const studentCourses = await StudentCourses.findOne({
      userId: payment.studentId,
    });

    const courseAlreadyEnrolled =
      studentCourses?.courses?.some((c) => c.courseId === payment.courseId);

    if (!courseAlreadyEnrolled) {
      if (studentCourses) {
        studentCourses.courses.push({
          courseId: payment.courseId,
          title: course.title,
          instructorId: course.instructorId,
          instructorName: course.instructorName,
          dateOfPurchase: new Date(),
          courseImage: course.image,
        });
        await studentCourses.save();
      } else {
        await StudentCourses.create({
          userId: payment.studentId,
          courses: [
            {
              courseId: payment.courseId,
              title: course.title,
              instructorId: course.instructorId,
              instructorName: course.instructorName,
              dateOfPurchase: new Date(),
              courseImage: course.image,
            },
          ],
        });
      }

      await Course.findByIdAndUpdate(payment.courseId, {
        $addToSet: {
          students: {
            studentId: payment.studentId,
            studentName: userName || "Student",
            studentEmail: userEmail || "",
            paidAmount: String(payment.amount),
          },
        },
      });
    }

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      data: {
        courseId: payment.courseId,
        alreadyEnrolled: courseAlreadyEnrolled || false,
      },
    });
  } catch (err) {
    console.error("Razorpay verify error:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Payment verification failed",
    });
  }
};

module.exports = { createRazorpayOrder, verifyRazorpayPayment };
