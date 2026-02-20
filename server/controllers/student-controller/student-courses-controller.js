const StudentCourses = require("../../models/StudentCourses");
const Course = require("../../models/Course");
const CourseProgress = require("../../models/CourseProgress");

const getCoursesByStudentId = async (req, res) => {
  try {
    const { studentId } = req.params;
    const studentBoughtCourses = await StudentCourses.findOne({
      userId: studentId,
    });

    res.status(200).json({
      success: true,
      data: studentBoughtCourses.courses,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const dropCourse = async (req, res) => {
  try {
    const { studentId, courseId } = req.params;

    const studentCourses = await StudentCourses.findOne({ userId: studentId });
    if (!studentCourses || !studentCourses.courses?.length) {
      return res.status(404).json({
        success: false,
        message: "No enrolled courses found",
      });
    }

    const courseIndex = studentCourses.courses.findIndex(
      (c) => c.courseId === courseId
    );
    if (courseIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Course not found in your enrollments",
      });
    }

    studentCourses.courses.splice(courseIndex, 1);
    await studentCourses.save();

    await Course.findByIdAndUpdate(courseId, {
      $pull: { students: { studentId } },
    });

    await CourseProgress.deleteOne({ userId: studentId, courseId });

    res.status(200).json({
      success: true,
      message: "Course dropped successfully",
      data: studentCourses.courses,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to drop course",
    });
  }
};

module.exports = { getCoursesByStudentId, dropCourse };
