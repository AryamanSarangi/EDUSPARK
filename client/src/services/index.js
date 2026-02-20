import axiosInstance from "@/api/axiosInstance";

export async function registerService(formData) {
  try {
    console.log("🚀 Sending register data:", formData); // <--- ADD THIS

    const roleToSend = formData.role || "student";
    const { data } = await axiosInstance.post("/auth/register", {
      ...formData,
      role: roleToSend,
    });

    console.log("✅ registerService response:", data); // <--- OPTIONAL
    return data;
  } catch (err) {
    console.error("❌ registerService error:", err.response?.data || err.message);
    return err.response?.data || { success: false, message: "Could not register" };
  }
}




export async function loginService(formData) {
  const { data } = await axiosInstance.post("/auth/login", formData);

  return data;
}

export async function checkAuthService() {
  const { data } = await axiosInstance.get("/auth/check-auth");

  return data;
}

export async function mediaUploadService(formData, onProgressCallback) {
  try {
    const { data } = await axiosInstance.post("/media/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        if (onProgressCallback) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgressCallback(percentCompleted);
        }
      },
    });

    // Expected backend response:
    // { success: true, data: { secure_url, url, public_id } }
    return data;
  } catch (error) {
    console.error("❌ mediaUploadService error:", error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
}


export async function mediaDeleteService(id) {
  const { data } = await axiosInstance.delete(`/media/delete/${id}`);

  return data;
}

export async function fetchInstructorCourseListService() {
  const { data } = await axiosInstance.get(`/instructor/courses/get`);

  return data;
}

export async function addNewCourseService(formData) {
  const { data } = await axiosInstance.post(`/instructor/courses/add`, formData);

  return data;
}

export async function fetchInstructorCourseDetailsService(id) {
  const { data } = await axiosInstance.get(
    `/instructor/courses/get/details/${id}`
  );

  return data;
}

export async function updateCourseByIdService(id, formData) {
  const { data } = await axiosInstance.put(
    `/instructor/courses/update/${id}`,
    formData
  );

  return data;
}

export async function deleteCourseByIdService(id) {
  const { data } = await axiosInstance.delete(`/instructor/courses/delete/${id}`);
  return data;
}

export async function mediaBulkUploadService(formData, onProgressCallback) {
  const { data } = await axiosInstance.post("/media/bulk-upload", formData, {
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      onProgressCallback(percentCompleted);
    },
  });

  return data;
}

export async function fetchStudentViewCourseListService(query, studentId) {
  const url = new URLSearchParams(query);
  if (studentId) {
    url.set("studentId", studentId);
  }
  const { data } = await axiosInstance.get(`/student/courses/get?${url}`);

  return data;
}

export async function fetchStudentViewCourseDetailsService(courseId) {
  const { data } = await axiosInstance.get(
    `/student/courses/get/details/${courseId}`
  );

  return data;
}

export async function checkCoursePurchaseInfoService(courseId, studentId) {
  const { data } = await axiosInstance.get(
    `/student/courses/purchase-info/${courseId}/${studentId}`
  );

  return data;
}

export async function createPaymentService(formData) {
  const { data } = await axiosInstance.post(`/student/orders/create`, formData);

  return data;
}

export async function createRazorpayOrderService(payload) {
  const { data } = await axiosInstance.post(`/student/order/create`, payload);
  return data;
}

export async function verifyRazorpayPaymentService(payload) {
  const { data } = await axiosInstance.post(`/student/order/verify`, payload);
  return data;
}

export async function captureAndFinalizePaymentService(
  paymentId,
  payerId,
  orderId
) {
  const { data } = await axiosInstance.post(`/student/orders/capture`, {
    paymentId,
    payerId,
    orderId,
  });

  return data;
}

export async function fetchStudentBoughtCoursesService(studentId) {
  const { data } = await axiosInstance.get(
    `/student/my-courses/get/${studentId}`
  );

  return data;
}

export async function dropCourseService(studentId, courseId) {
  const { data } = await axiosInstance.delete(
    `/student/my-courses/drop/${studentId}/${courseId}`
  );

  return data;
}

export async function enrollCourseService(studentId, courseId) {
  const { data } = await axiosInstance.post(`/student/course/enroll`, {
    studentId,
    courseId,
  });
  return data;
}

export async function getCurrentCourseProgressService(userId, courseId) {
  const { data } = await axiosInstance.get(
    `/student/progress/get/${userId}/${courseId}`
  );

  return data;
}

export async function markLectureAsViewedService(userId, courseId, lectureId) {
  const { data } = await axiosInstance.post(
    `/student/progress/mark-lecture-viewed`,
    {
      userId,
      courseId,
      lectureId,
    }
  );

  return data;
}

export async function resetCourseProgressService(userId, courseId) {
  const { data } = await axiosInstance.post(
    `/student/progress/reset-progress`,
    {
      userId,
      courseId,
    }
  );

  return data;
}
