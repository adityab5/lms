import Payment from "../models/payment.model.js";
import User from "../models/user.model.js";
import { razorpay } from "../server.js";
import AppError from "../utils/error.util.js";
import crypto from "crypto";
export const getRazorpayApiKey = async (req, res) => {
    try{
        return res.status(200).json({
          success: true,
          message: "Razorpay API key fetched successfully",
          key: process.env.RAZORPAY_KEY_ID,
        });
    }catch(err){
        return next(new AppError(err.message, 500));
    }
};

export const buySubscription = async (req, res, next) => {
  try {
    // console.log("req_user",req.user);
    const { id } = req.user;
    const user = await User.findById(id);
    console.log("usercgfcfg",user);
    

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    if (user.role === "ADMIN") {
      return next(new AppError("Admin cannot buy a subscription", 403));
    }
    

    const subscription = await razorpay.subscriptions.create({
      plan_id: "plan_Olcy78WrikZEcm",
      customer_notify: 1, // 1 for sending email to customer
      total_count: 12,
      // customer_id: user.razorpayCustomerId,
    });
    // console.log(subscription);
    
    
    user.subscription.id = subscription.id;
    user.subscription.status = subscription.status;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Subscription bought successfully",
      subscription_id: subscription.id,
    });
  } catch (err) {
    console.error("Error in buySubscription:", JSON.stringify(err, null, 2)); // Log the error
    return next(new AppError(err.message, 400));
  }
};



export const verifySubscription = async (req, res,next) => { //verify the redirect from razorpay (post request at client side)
    try{
        const { id } = req.user;
        const {razorpay_payment_id, razorpay_subscription_id, razorpay_signature} = req.body;
        console.log("body",req.body);
        
        if (
          !razorpay_payment_id ||
          !razorpay_subscription_id ||
          !razorpay_signature
        ) {
          return next(
            new AppError(
              "Payment ID, Subscription ID, and Signature are required",
              400
            )
          );
        }
        const user = await User.findById(id);

        if (!user) {
            return next(new AppError("User not found", 404));
        }


        const generatedSignature = crypto
          .createHmac("sha256", "8f1AZQdXGvfkAbMijBxce4da")
          .update(`${razorpay_payment_id}|${razorpay_subscription_id}`)
          .digest("hex");


        console.log("Generated Signature:", generatedSignature);
        console.log("Razorpay Signature:", razorpay_signature);

        if (generatedSignature !== razorpay_signature) {
          return next(new AppError("Invalid signature", 400));
        }

        await Payment.create({
          payment_id: razorpay_payment_id,
          signature: razorpay_signature,
          subscription_id: razorpay_subscription_id,
        });

        user.subscription.status = "active";
        console.log("user",user);
        
        const u = await user.save();
        console.log("u",u);


        res.status(200).json({
            success: true,
            message: "Subscription verified successfully",
        });
    }catch(err){
        return next(new AppError(err.message, 400));
    }

    };

export const cancelSubscription = async (req, res,next) => {
    try{    
    const { id } = req.user;

    const user = await User.findById(id);
    if (!user) {
        return next(new AppError("User not found", 404));
    }

    if(user.role === 'ADMIN'){
        return next(new AppError("Admin cannot cancel a subscription", 403));
    }

    const subscriptionId = user.subscription.id;

    const subscription = await razorpay.subscriptions.cancel(subscriptionId);

    user.subscription.status = subscription.status;

    await user.save();
    }catch(err){
        return next(new AppError(err.message, 400));
    }
};

export const allPayments = async (req, res,next) => {
    const { count } = req.query;

    const subscriptions = await razorpay.subscriptions.all({ limit: count || 10 });

    res.status(200).json({
        success: true,
        count: subscriptions.length,
        subscriptions,
    });
};