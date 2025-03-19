import axios from "axios";
import { toast } from "sonner";

class orderApiClient {
  orderApi = axios.create({
    baseURL: "http://localhost:5000/api/v1/order",
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
    data: {},
  });

  async createOrder(data) {
    try {
      const response = await this.orderApi.post("/create", data);

      if (!response.data.success) {
        throw new Error("Failed to create order");
      }
      //   console.log("response", response);
      return response;
    } catch (error) {
      console.log("Failed to create order", error);
      toast.error(error.message);
    }
  }

  async confirmOrder(order_details) {
    try {
      const response = await this.orderApi.post("/success", order_details);
      //   console.log("response", response);
      return response;
    } catch (error) {
      console.log("Failed to capture payment", error);
      toast.error(error.message);
    }
  }
}

export default new orderApiClient();
