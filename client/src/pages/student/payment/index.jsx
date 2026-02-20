import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthContext } from "@/context/auth-context";
import { useToast } from "@/components/ui/use-toast";
import {
  enrollCourseService,
  fetchStudentViewCourseDetailsService,
} from "@/services";
import { Loader2 } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function PaymentPage() {
  const { courseId } = useParams();
  const { auth } = useContext(AuthContext);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    if (!auth?.user?._id) {
      toast({ title: "Error", description: "Please log in to purchase", variant: "destructive" });
      navigate("/auth");
      return;
    }
    if (!courseId) {
      navigate("/courses");
      return;
    }

    async function fetchCourse() {
      const response = await fetchStudentViewCourseDetailsService(courseId);
      if (response?.success) {
        setCourse(response.data);
      } else {
        toast({ title: "Error", description: "Course not found", variant: "destructive" });
        navigate("/courses");
      }
      setLoading(false);
    }
    fetchCourse();
  }, [courseId, auth?.user?._id]);

  async function handlePayment() {
    if (!auth?.user?._id || !courseId) return;

    setPaymentLoading(true);

    setTimeout(async () => {
      try {
        const response = await enrollCourseService(auth.user._id, courseId);

        if (response?.success) {
          toast({
            title: "Payment successful!",
            description: "Course added to your dashboard.",
          });
          navigate("/student-courses");
        } else {
          toast({
            title: "Error",
            description: response?.message || "Failed to enroll",
            variant: "destructive",
          });
        }
      } catch (err) {
        toast({
          title: "Error",
          description: err?.response?.data?.message || "Enrollment failed",
          variant: "destructive",
        });
      } finally {
        setPaymentLoading(false);
      }
    }, 2000);
  }

  function handleCancel() {
    navigate(`/course/details/${courseId}`);
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (!course) return null;

  const studentName = auth?.user?.userName || auth?.user?.name || "Student";
  const studentEmail = auth?.user?.userEmail || auth?.user?.email || "";

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl">Confirm Payment</CardTitle>
          <p className="text-sm text-gray-500">Simulated payment - No real charges</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-lg bg-gray-50 dark:bg-gray-900 p-4 space-y-3">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Course</p>
              <p className="font-semibold text-lg">{course.title}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Amount</p>
              <p className="text-2xl font-bold text-primary">₹{course.pricing}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Student</p>
              <p className="font-medium">{studentName}</p>
              {studentEmail && (
                <p className="text-sm text-gray-600">{studentEmail}</p>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={handlePayment}
            disabled={paymentLoading}
            className="flex-1"
          >
            {paymentLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Pay Now"
            )}
          </Button>
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={paymentLoading}
            className="flex-1"
          >
            Cancel
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default PaymentPage;
