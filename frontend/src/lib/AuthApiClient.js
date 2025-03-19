import axios from "axios";
import { toast } from "sonner";

class AuthApiClient {
  authApi = axios.create({
    baseURL: "http://localhost:5000/api/v1/user",
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });

  async signupUser(credentials) {
    try {
      const response = await this.authApi.post(`/signup`, credentials);

      if (!response.data.success) {
        throw new Error("Error signup user");
      }

      return response;
    } catch (error) {
      console.log("Error signup user", error);
      toast.error(error.response.data.error, {
        style: { backgroundColor: "red" },
      });
    }
  }

  async loginUser(credentials) {
    try {
      const response = await this.authApi.post(`/login`, credentials);

      if (!response.data.success) {
        throw new Error("Error login user");
      }

      return response;
    } catch (error) {
      console.log("Error login user", error);
      toast.error(error.response.data.error, {
        style: { backgroundColor: "red" },
      });
    }
  }

  async getUser() {
    try {
      const response = await this.authApi.get(`/profile`);

      if (!response.data.success) {
        throw new Error("Error get user");
      }

      return response;
    } catch (error) {
      console.log("Error get user", error);
      toast.error(error.response.data.error, {
        style: { backgroundColor: "red" },
      });
    }
  }

  async logoutUser() {
    try {
      const response = await this.authApi.get(`/logout`);
      if (!response.data.success) {
        throw new Error("Error logout user");
      }

      return response;
    } catch (error) {
      console.log("Error logout user", error);
      toast.error(error.response.data.error, {
        style: { backgroundColor: "red" },
      });
    }
  }

  async updateUser(credentials) {
    try {
      const response = await this.authApi.put(`/profile/update`, credentials, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (!response.data.success) {
        throw new Error("Error update user");
      }

      return response;
    } catch (error) {
      console.log("Error update user", error);
      toast.error(error.response.data.error, {
        style: { backgroundColor: "red" },
      });
    }
  }
}

export default new AuthApiClient();
