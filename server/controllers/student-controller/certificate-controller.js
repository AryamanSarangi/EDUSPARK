const PDFDocument = require("pdfkit");
const User = require("../../models/User");
const Course = require("../../models/Course");
const CourseProgress = require("../../models/CourseProgress");
const StudentCourses = require("../../models/StudentCourses");

const generateCertificate = async (req, res) => {
  try {
    const { courseId, userId } = req.params;

    const student = await User.findById(userId);
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    const studentCourses = await StudentCourses.findOne({ userId });
    const isEnrolled = studentCourses?.courses?.some((c) => c.courseId === courseId);
    if (!isEnrolled) {
      return res.status(403).json({
        success: false,
        message: "You must be enrolled in this course to download the certificate",
      });
    }

    const progress = await CourseProgress.findOne({ userId, courseId });
    if (!progress || !progress.completed) {
      return res.status(403).json({
        success: false,
        message: "Complete the course to download your certificate",
      });
    }

    const studentName = student.userName || student.name || "Student";
    const completionDate = progress.completionDate
      ? new Date(progress.completionDate).toLocaleDateString("en-IN", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : new Date().toLocaleDateString("en-IN", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });

    const filename = `EduSpark_Certificate_${course.title.replace(/\s+/g, "_")}_${studentName.replace(/\s+/g, "_")}.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    const doc = new PDFDocument({ size: "A4", layout: "landscape", margin: 60 });
    doc.pipe(res);

    const pageWidth = doc.page.width;
    const textWidth = pageWidth - 120;
    const startX = 60;

    doc.fontSize(36).fillColor("#1a1a2e").text("EduSpark", startX, 50, { width: textWidth, align: "center" });
    doc.fontSize(10).fillColor("#666").text("Learn. Grow. Achieve.", startX, 90, { width: textWidth, align: "center" });
    doc.fontSize(28).fillColor("#1a1a2e").text("Certificate of Completion", startX, 120, { width: textWidth, align: "center" });

    doc.fontSize(14).fillColor("#333").text("This is to certify that", startX, 200, { width: textWidth, align: "center" });
    doc.fontSize(24).fillColor("#1a1a2e").text(studentName, startX, 230, { width: textWidth, align: "center" });
    doc.fontSize(14).fillColor("#333").text("has successfully completed the course", startX, 280, { width: textWidth, align: "center" });
    doc.fontSize(22).fillColor("#16213e").text(course.title, startX, 315, { width: textWidth, align: "center" });

    doc.fontSize(12).fillColor("#555").text(`Date: ${completionDate}`, startX, 380, { width: textWidth, align: "center" });
    if (course.instructorName) {
      doc.fontSize(12).fillColor("#555").text(`Instructor: ${course.instructorName}`, startX, 405, { width: textWidth, align: "center" });
    }

    const lineY = 480;
    const centerX = pageWidth / 2;
    doc.moveTo(centerX - 80, lineY).lineTo(centerX + 80, lineY).strokeColor("#333").stroke();
    doc.fontSize(10).fillColor("#666").text("Authorized Signature", startX, lineY + 8, { width: textWidth, align: "center" });

    doc.end();
  } catch (err) {
    console.error("Certificate error:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Failed to generate certificate",
    });
  }
};

module.exports = { generateCertificate };
