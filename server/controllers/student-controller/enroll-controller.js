const User = require("../../models/User");
const Course = require("../../models/Course");
const StudentCourses = require("../../models/StudentCourses");

const enrollCourse = async (req, res) => {
  try {
    const { studentId, courseId } = req.body;

    if (!studentId || !courseId) {
      return res.status(400).json({
        success: false,
        message: "studentId and courseId are required",
      });
    }

    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    let studentCourses = await StudentCourses.findOne({ userId: studentId });

    const alreadyEnrolled =
      studentCourses?.courses?.some((c) => c.courseId === courseId) ?? false;
    if (alreadyEnrolled) {
      return res.status(400).json({
        success: false,
        message: "You are already enrolled in this course",
      });
    }

    if (studentCourses) {
      studentCourses.courses.push({
        courseId: course._id.toString(),
        title: course.title,
        instructorId: course.instructorId,
        instructorName: course.instructorName,
        dateOfPurchase: new Date(),
        courseImage: course.image,
      });
      await studentCourses.save();
    } else {
      studentCourses = new StudentCourses({
        userId: studentId,
        courses: [
          {
            courseId: course._id.toString(),
            title: course.title,
            instructorId: course.instructorId,
            instructorName: course.instructorName,
            dateOfPurchase: new Date(),
            courseImage: course.image,
          },
        ],
      });
      await studentCourses.save();
    }

    await Course.findByIdAndUpdate(courseId, {
      $addToSet: {
        students: {
          studentId,
          studentName: student.userName || "Student",
          studentEmail: student.userEmail || "",
          paidAmount: String(course.pricing || 0),
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "Course enrolled successfully",
      data: { courseId },
    });
  } catch (err) {
    console.error("Enroll error:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Failed to enroll in course",
    });
  }
};

module.exports = { enrollCourse };
