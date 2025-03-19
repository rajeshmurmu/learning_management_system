import { toast } from "sonner";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import orderApiClient from "@/lib/orderApiClient";
import PropTypes from "prop-types";
// import { useEffect } from "react";
// import { loadScript } from "@/lib/razorpay/loadScript";
import { useSelector } from "react-redux";
import renderRazorpay from "@/lib/razorpay/renderRazorpay";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function BuyCourseButton({ course }) {
  // console.log(course.courseTitle);
  // const user = JSON.parse(localStorage.getItem("user"));
  const { user } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const handlePurchase = async () => {
    setIsLoading(true);
    if (!user) {
      toast.error("Please login to make a purchase", "error");
      navigate("/auth");
      return;
    }

    if (!course?._id) {
      toast.error("Invalid product", "error");
      return;
    }

    try {
      const response = await orderApiClient.createOrder({
        course_id: course._id,
      });

      // if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
      //   showNotification("Razorpay key is missing", "error");
      //   return;
      // }

      if (!response.data.success) {
        toast.error(
          response.data.error ||
            response.data.message ||
            "Something went wrong",
          "error"
        );

        return;
      }

      // setCreatedOrder(response.data.order);
      if (response.data.success) {
        // console.log(response.data.order);
        await renderRazorpay({
          amount: response.data.order.amount,
          course_id: course._id,
          courseTitle: course?.courseTitle,
          order_id: response.data.order.order_id,
          db_order_id: response.data.order.db_order_id,
          user,
        });
      }
    } catch (error) {
      console.error("pay button error", error);
    } finally {
      setIsLoading(false);
    }
  };

  // const src = "https://checkout.razorpay.com/v1/checkout.js";

  // useEffect(() => {
  //   loadScript(src);
  // });
  return (
    <Button disabled={isLoading} onClick={handlePurchase}>
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Purchase
      Course
    </Button>
  );
}

BuyCourseButton.propTypes = {
  course: PropTypes.object.isRequired,
};
