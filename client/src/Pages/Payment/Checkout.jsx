import { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import HomeLayout from "../../Layouts/HomeLayout";
import { BiRupee } from "react-icons/bi";
import {
  
    getRazorPayId,
  purchaseCourseBundle,
  verifyUserPayment,
} from "../../Redux/Slice/RazorpaySlice";

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const razorpayId = useSelector((state) => state?.razorpay?.key);
  const subscription_id = useSelector((state) => state?.razorpay?.subscription_id);
  const isPaymentVerified = useSelector((state) => state?.razorpay?.isPaymentVerified);
  const userData = useSelector((state) => state?.auth?.data);
 console.log(razorpayId);
 
  const paymentDetails = {
    razorpay_payment_id: "",
    razorpay_subscription_id: "",
    razorpay_signature: "",
  };

  const handleSubscription = (e) => {
    e.preventDefault();
    if (!razorpayId || !subscription_id) {
      toast.error("Failed to get RazorPay Id");
      return;
    }
    const options = {
      key: razorpayId,
      subscription_id: subscription_id,
      name: "Course Subscription",
      description: "Monthly Subscription",
      theme: {
        color: "#F37254",
      },
      prefill: {
        name: userData.fullName,
        email: userData.email,
      },
      handler: async function (response) {
        paymentDetails.razorpay_payment_id = response.razorpay_payment_id;
        paymentDetails.razorpay_subscription_id = response.razorpay_subscription_id;
        paymentDetails.razorpay_signature = response.razorpay_signature;
        console.log("paymentDetails", paymentDetails);
        

        toast.success("Payment Successful");

        const res = await dispatch(verifyUserPayment(paymentDetails)); // dispatching the payment verification // calling the backend to verify the payment
        console.log("payment success",res);
        
        (res?.payload?.success) ? navigate("/checkout/success") : navigate("/checkout/failure");
      },
    };
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  const load = async () => {
    const a=await dispatch(getRazorPayId());
    console.log(a);
    const b=await dispatch(purchaseCourseBundle());
    console.log(b);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <HomeLayout>
      {/* checkout page container */}
      <form
        onSubmit={handleSubscription}
        className="min-h-[90vh] flex items-center justify-center text-white"
      >
        {/* checkout card */}
        <div className="w-80 h-[26rem] flex flex-col justify-center shadow-[0_0_10px_black] rounded-lg relative">
          <h1 className="bg-indigo-500 absolute top-0 w-full text-center py-4 text-2xl font-bold rounded-tl-lg rounded-tr-lg">
            Subscription Bundle
          </h1>

          <div className="px-4 space-y-5 text-center">
            <p className="text-[17px]">
              This purchase will allow you to access all the available courses
              of our platform for{" "}
              <span className="text-indigo-500 font-bold">1 Year Duration</span>. <br />
              All the existing and new launched courses will be available to you
              in this subscription bundle
            </p>

            <p className="flex items-center justify-center gap-1 text-2xl font-bold text-indigo-500">
              <BiRupee /> <span>499</span>only
            </p>

            <div className="text-gray-200">
              <p>100% refund at cancellation</p>
              <p>* Terms & Condition Applied</p>
            </div>
          </div>

          <button
            type="submit"
            className="bg-indigo-500 hover:bg-indigo-600 transition-all ease-in-out duration-300 absolute bottom-0 w-full text-center py-2 text-xl font-bold rounded-bl-lg rounded-br-lg"
          >
            Buy Now
          </button>
        </div>
      </form>
    </HomeLayout>
  );
};

export default Checkout;
