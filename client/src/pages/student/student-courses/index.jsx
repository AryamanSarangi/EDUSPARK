import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import { fetchStudentBoughtCoursesService, dropCourseService } from "@/services";
import { Watch, Trash2 } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function StudentCoursesPage() {
  const { auth } = useContext(AuthContext);
  const { studentBoughtCoursesList, setStudentBoughtCoursesList } =
    useContext(StudentContext);
  const navigate = useNavigate();
  const [droppingId, setDroppingId] = useState(null);

  async function fetchStudentBoughtCourses() {
    const response = await fetchStudentBoughtCoursesService(auth?.user?._id);
    if (response?.success) {
      setStudentBoughtCoursesList(response?.data);
    }
  }

  async function handleDropCourse(courseId, courseTitle) {
    if (!window.confirm(`Are you sure you want to drop "${courseTitle}"? You will lose access to this course.`)) {
      return;
    }
    setDroppingId(courseId);
    try {
      const response = await dropCourseService(auth?.user?._id, courseId);
      if (response?.success) {
        setStudentBoughtCoursesList(response?.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDroppingId(null);
    }
  }

  useEffect(() => {
    fetchStudentBoughtCourses();
  }, [auth?.user?._id]);

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-8">My Courses</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {studentBoughtCoursesList && studentBoughtCoursesList.length > 0 ? (
          studentBoughtCoursesList.map((course) => (
            <Card key={course?.courseId || course?.id} className="flex flex-col">
              <CardContent className="p-4 flex-grow">
                <img
                  src={course?.courseImage}
                  alt={course?.title}
                  className="h-52 w-full object-cover rounded-md mb-4"
                />
                <h3 className="font-bold mb-1">{course?.title}</h3>
                <p className="text-sm text-gray-700 mb-2">
                  {course?.instructorName}
                </p>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button
                  onClick={() =>
                    navigate(`/course-progress/${course?.courseId}`)
                  }
                  className="flex-1"
                >
                  <Watch className="mr-2 h-4 w-4" />
                  Start Watching
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDropCourse(course?.courseId, course?.title);
                  }}
                  disabled={droppingId === course?.courseId}
                  title="Drop course"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <h1 className="text-3xl font-bold">No Courses found</h1>
        )}
      </div>
    </div>
  );
}

export default StudentCoursesPage;
