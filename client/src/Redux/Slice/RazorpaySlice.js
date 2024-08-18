import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axiosInstance from "../../Helpers/axiosInstance";

const initialState = {
  key: "",
  subscription_id: "",
  isPaymentVerified: false,
  allPayments: {},
  finalMonths: {},
  monthlySalesRecord: [],
};

export const getRazorPayId = createAsyncThunk("razorPayId/get", async () => {
  try {
    const response = await axiosInstance.get("/payments/razorpay-key");
    
    return response.data;
  } catch (error) {
    toast.error("Failed to get RazorPay Id");
  }
});

export const purchaseCourseBundle = createAsyncThunk(
  "purchaseCourse",
  async () => {
    try {
      const response = await axiosInstance.post("/payments/subscribe");
      console.log("response",response);
      return response?.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }
);

export const verifyUserPayment = createAsyncThunk(
  "verifyPayment",
  async (paymentDetail) => {
    try {
      const response = await axiosInstance.post("/payments/verify", {
        razorpay_payment_id: paymentDetail.razorpay_payment_id,
        razorpay_subscription_id: paymentDetail.razorpay_subscription_id,
        razorpay_signature: paymentDetail.razorpay_signature,
      });
      return response?.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }
);

export const getPaymentRecord = createAsyncThunk("paymentRecord", async () => {
  try {
    const response = axiosInstance.get("/payments?count=100");
    toast.promise(response, {
      loading: "Loading...",
      success: (data) => {
        return data?.data?.message;
      },
      error: "Failed to get payment record",
    });
    return (await response)?.data;
  } catch (error) {
    toast.error("Failed operation");
  }
});

export const cancelCourseBundle = createAsyncThunk("cancelCourse", async () => {
  try {
    const response = await axiosInstance.get("/payments/unsubscribe");
    toast.promise(response, {
      loading: "Loading...",
      success: (data) => {
        return data?.data?.message;
      },
      error: "Failed to cancel subscription",
    });
    return (await response)?.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
});

const razorpaySlice = createSlice({
  name: "razorpay",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getRazorPayId.rejected, (state, action) => {
        toast.error("Failed to get RazorPay Id");
      })
      .addCase(getRazorPayId.fulfilled, (state, action) => {
        state.key = action.payload?.key;
      })
      .addCase(purchaseCourseBundle.fulfilled, (state, action) => {
        state.subscription_id = action.payload?.subscription_id;
      })
      .addCase(verifyUserPayment.fulfilled, (state, action) => {
        if (action.payload?.success) {
          state.isPaymentVerified = true;
          toast.success("Payment verified successfully");
        } else {
          state.isPaymentVerified = false;
          toast.error(action.payload?.message || "Payment verification failed");
        }
      })
      .addCase(verifyUserPayment.rejected, (state, action) => {
        state.isPaymentVerified = false;
        toast.error(action.error.message || "Payment verification failed");
      })
      .addCase(getPaymentRecord.fulfilled, (state, action) => {
        state.allPayments = action.payload?.allPayments;
        state.finalMonths = action.payload?.finalMonths;
        state.monthlySalesRecord = action.payload?.monthlySalesRecord;
      });
  },
});


export const {} = razorpaySlice.actions;
export default razorpaySlice.reducer;
