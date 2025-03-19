import { toast } from "sonner";
import orderApiClient from "../orderApiClient";

const renderRazorpay = async ({
  amount,
  course_id,
  courseTitle,
  order_id,
  db_order_id,
  user,
}) => {
  // console.log(db_order_id);
  try {
    const options = {
      key: "rzp_test_nAloRd6s3MYp8M",
      // key: await import.meta.env.REACT_APP_RAZORPAY_KEY_ID,
      amount: amount,
      //   amount: 120000,
      currency: "INR",
      name: "E-Learning",
      description: `${course_id} - ${courseTitle} Version`,
      order_id: order_id,

      handler: async function (response) {
        // toast.success("Payment successful!", {
        //   style: {
        //     background: "green",
        //   },
        //   dismissible: true,
        // });
        // navigate("/orders");
        // here you can add your logic after payment success
        // currently it will call success route in the server to capture payment in production it will be handled through webhook

        // console.log(response);
        try {
          const res = await orderApiClient.confirmOrder({
            order_id: response.razorpay_order_id,
            payment_id: response.razorpay_payment_id,
            payment_signature: response.razorpay_signature,
            db_order_id: db_order_id,
          });

          console.log(res);
          if (res.data.success) {
            toast.success(res.data?.message || "Payment successful!", {
              style: { background: "green" },
            });
          } else {
            toast.error(
              res.data.error ||
                "Payment failed, if your money has been debited please contact us",
              {
                style: { background: "red" },
              }
            );
          }
        } catch (error) {
          console.log("order verify error", error);
        }
      },
      prefill: {
        email: user?.email,
        name: user?.name,
        contact: user?.phone || user?.email,
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (error) {
    console.log("error render razorpay", error);
  }
};

export default renderRazorpay;
