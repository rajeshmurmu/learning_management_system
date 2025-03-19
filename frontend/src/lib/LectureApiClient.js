import axios from "axios";
import { toast } from "sonner";

class LectureApiClient {
  // constructor() {
  //     this.baseURL = "http://localhost:8000/api";
  // }

  lectureApi = axios.create({
    baseURL: "http://localhost:5000/api/v1/lectures",
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
    data: {},
  });

  async createLecture(course_id, lectureData) {
    try {
      const response = await this.lectureApi.post(`/${course_id}`, lectureData);

      if (!response.data.success) {
        throw new Error("Error while creating lecture");
      }

      return response;
    } catch (error) {
      console.log("Error while creating lecture", error);
      toast.error(error.message || "Error while creating lecture");
    }
  }

  async getLectures(course_id) {
    try {
      const response = await this.lectureApi.get(`/${course_id}`);
      // console.log("response", response);

      if (!response.data.success) {
        throw new Error("Failed to fetch lectures");
      }

      return response;
    } catch (error) {
      console.log("Failed to fetch lectures", error);
    }
  }

  async updateLecture(course_id, lecture_id, data) {
    try {
      const response = await this.lectureApi.put(
        `/${lecture_id}/courses/${course_id}`,
        data
      );
      if (!response.data.success) {
        console.log(response);
        throw new Error(response.data.error);
      }
      return response;
    } catch (error) {
      console.log("error updating lecture", error);
    }
  }

  async getLectureById(course_id, lecture_id) {
    try {
      const response = await this.lectureApi.get(
        `/${lecture_id}/courses/${course_id}`
      );
      if (!response.data.success) {
        console.log(response);
        throw new Error("Error fetching course");
      }

      return response;
    } catch (error) {
      console.log("error fetching lecture", error);
    }
  }

  async removeLecture(course_id, lecture_id) {
    try {
      const response = await this.lectureApi.delete(
        `/${lecture_id}/courses/${course_id}`
      );
      if (!response.data.success) {
        console.log(response);
        throw new Error("Error removing course");
      }

      return response;
    } catch (error) {
      console.log("error removing lecture", error);
    }
  }
}

export default new LectureApiClient();
