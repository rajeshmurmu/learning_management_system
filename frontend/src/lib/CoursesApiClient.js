import axios from "axios";
import { toast } from "sonner";

class CoursesApiClient {
  courseAPI = axios.create({
    baseURL: "http://localhost:5000/api/v1/courses",
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
    data: {},
  });

  async createCourse(courseData) {
    try {
      const response = await this.courseAPI.post("/create", courseData);

      if (!response.data.success) {
        throw new Error("Failed to create course");
      }

      return response;
    } catch (error) {
      console.log("Failed to create course", error);
      toast.error(error.message);
    }
  }

  async getCourses() {
    try {
      const response = await this.courseAPI.get("/");

      if (!response.data.success) {
        throw new Error("Failed to fetch courses");
      }

      return response;
    } catch (error) {
      console.log("Failed to fetch courses", error);
    }
  }

  async getCourseById(course_id) {
    try {
      const response = await this.courseAPI.get(`/${course_id}`);

      if (!response.data.success) {
        throw new Error("Failed to get course");
      }

      return response;
    } catch (error) {
      console.log("Error getting course", error);
    }
  }

  async editCourse(course_id, courseData) {
    try {
      const response = await this.courseAPI.put(
        `/edit/${course_id}`,
        courseData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (!response.data.success) {
        throw new Error("Failed to update course");
      }

      return response;
    } catch (error) {
      console.log("Failed to update course", error);
      toast.error(error.message);
    }
  }

  async deleteCourse(course_id) {
    try {
      const response = await this.courseAPI.delete(`/${course_id}`);

      if (!response.data.success) {
        throw new Error("Failed to delete course");
      }

      return response;
    } catch (error) {
      console.log("Failed to delete course", error);
      toast.error(error.message);
    }
  }

  async togglePublishCourse(course_id) {
    try {
      const response = await this.courseAPI.put(`/${course_id}`);

      if (!response.data.success) {
        throw new Error("Failed to publish course");
      }

      return response;
    } catch (error) {
      console.log("Failed to publish course", error);
      toast.error(error.message);
    }
  }

  async getPublishedCourses() {
    try {
      const response = await this.courseAPI.get("/published");

      if (!response.data.success) {
        throw new Error("Failed to get published courses");
      }

      return response;
    } catch (error) {
      console.log("Failed to get published courses", error);
    }
  }

  // course progress api's

  async getCourseProgress(course_id) {
    try {
      const response = await this.courseAPI.get(`/progress/${course_id}`);

      if (!response.data.success) {
        throw new Error("Failed to get course progress");
      }

      return response;
    } catch (error) {
      console.log("Failed to get course progress", error);
    }
  }

  async updateCourseLectureProgress(course_id, lecture_id) {
    try {
      const response = await this.courseAPI.post(
        `/progress/${course_id}/lecture/${lecture_id}`
      );

      if (!response.data.success) {
        throw new Error("Failed to update course progress");
      }

      return response;
    } catch (error) {
      console.log("Failed to update course progress", error);
    }
  }

  async markLectureAsCompleted(course_id, lecture_id) {
    try {
      const response = await this.courseAPI.put(
        `/progress/${course_id}/lecture/${lecture_id}`
      );

      if (!response.data.success) {
        throw new Error("Failed to mark lecture as completed");
      }

      return response;
    } catch (error) {
      console.log("Failed to mark lecture as completed", error);
    }
  }
}

export default new CoursesApiClient();
