import AppError from "../utils/error.util.js";
import User from "../models/user.model.js";
import cloudinary from "cloudinary";
import fs from "fs/promises";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";

const cookieOptions = {
  maxAge: 7 * 24 * 60 * 60 * 1000, //7 days
  httpOnly: true,
  secure: true,
};

const register = async (req, res, next) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    // return res.status(400).json({message:"Please provide all fields"});
    return next(new AppError("Please provide all fields", 400));
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    // return res.status(400).json({message:"User already exist"});
    return next(new AppError("User already exist", 400));
  }

  const user = await User.create({
    fullName,
    email,
    password,
    avatar: {
      public_id: email,
      secure_url: null,
    },
  });

  if (!user) {
    // return res.status(400).json({message:"Invalid credentials"});
    return next(new AppError("Invalid credentials", 400));
  }

  // const apiKey = process.env.CLOUDINARY_API_KEY;
  //       console.log('API Key:', apiKey); // Debugging statement to log the API key

  //       if (!apiKey) {
  //           throw new Error('Must supply api_key');}

  //TODO: file upload

  console.log("File Details:", JSON.stringify(req.file));
  // run only if user sends a file
  if (req.file) {
    // console.log(req.file);
    try {
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "lms",
        width: 250,
        hight: 250,
        gravity: "faces",
        crop: "fill",
      });
      // console.log(result);

      if (result) {
        user.avatar.public_id = result.public_id;
        user.avatar.secure_url = result.secure_url;

        // Remove from the server (local storage)
        fs.rm(`uploads/${req.file.filename}`);
      }
    } catch (error) {
      return next(new AppError(error || "Something went wrong", 500));
    }
  }
  // user.subscription;
  await user.save();

  user.password = undefined;
  // login the user after registration (generate token)
  const token = await user.generateJWTToken();

  // res.cookie('token',token,{
  //     httpOnly:true,
  //     sameSite:true,
  // });

  res.cookie("token", token, cookieOptions);

  res.status(201).json({
    success: true,
    message: "User created successfully",
    user,
  });
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      // return res.status(400).json({message:"Please provide all fields"});
      return next(new AppError("Please provide all fields", 400));
    }

    const user = await User.findOne({
      email,
    }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      // return res.status(400).json({message:"Invalid credentials"});
      return next(new AppError("Invalid credentials", 400));
    }

    const token = await user.generateJWTToken();
    user.password = undefined;

    res.cookie("token", token, cookieOptions);

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user,
    });
  } catch (err) {
    return next(new AppError(err.message, 500));
  }
};

const logout = (req, res) => {
  res.cookie("token", null, {
    secure: true,
    maxAge: 0,
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "User logged out successfully",
  });
};

const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    res.status(200).json({
      success: true,
      message: "User profile fetched successfully",
      user,
    });
  } catch (err) {
    return next(new AppError(err.message, 500));
  }
};

const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new AppError("Please provide an email address", 400));
  }

  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError("User not found", 404));
  }

  const resetToken = await user.generatePasswordResetToken();

  await user.save();

  const resetPasswordURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  console.log(resetPasswordURL);

  const subject = "Password reset token";
  const message = `Your password reset token is as follows: \n\n <a href=${resetPasswordURL} target="_blank">Reset Your Password</a> \n\n If you have not requested this email, then ignore it. \n\n If the link is not working, then copy and paste the following URL in your browser: ${resetPasswordURL} \n\n\n\n Regards, \n Team LMS`;
  try {
    await sendEmail(email, subject, message);

    res.status(200).json({
      success: true,
      message: `Password reset email sent successfully to ${email}`,
    });
  } catch (e) {
    user.forgetPasswordExpire = undefined; //remove the token if email is not sent for some reason (safety purpose)
    user.forgetPasswordToken = undefined; //remove the token if email is not sent for some reason (safety purpose)

    await user.save();
    return next(new AppError(e.message || "Email could not be sent", 500));
  }
};

const resetPassword = async (req, res, next) => {
  const { resetToken } = req.params;

  const { password } = req.body;

  const forgetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  const user = await User.findOne({
    forgetPasswordToken,
    forgetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError("Invalid or expired reset token", 400));
  }

  user.password = password;
  user.forgetPasswordExpiry = undefined;
  user.forgetPasswordToken = undefined;

  user.save();

  res.status(200).json({
    success: true,
    message: "Password reset successfully",
  });
};

const changePassword = async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return next(new AppError("Please provide all fields", 400));
  }

  const user = await User.findById(req.user.id).select("+password");
  if (!user) {
    return next(new AppError("User not found", 404));
  }

  const isPasswordValid = await user.comparePassword(oldPassword);
  if (!isPasswordValid) {
    return next(new AppError("Invalid old password", 400));
  }

  user.password = newPassword;

  await user.save();

  user.password = undefined;

  res.status(200).json({
    success: true,
    message: "Password changed successfully",
  });
};

const updateUser = async (req, res, next) => {
  console.log("body",req.body); 
  
  const fullName = req.body;
  const id  = req.user.id;
  console.log(id);


  const user = await User.findById(id);

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  if (req.fullName) {
    user.fullName = fullName;
  }

  if (req.file) {
    await cloudinary.v2.uploader.destroy(user.avatar.public_id);
    try {
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "lms",
        width: 250,
        hight: 250,
        gravity: "faces",
        crop: "fill",
      });
      // console.log(result);

      if (result) {
        user.avatar.public_id = result.public_id;
        user.avatar.secure_url = result.secure_url;

        // Remove from the server
        fs.rm(`uploads/${req.file.filename}`);
      }
    } catch (error) {
      return next(new AppError(error || "Something went wrong", 500));
    }
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: "User updated successfully",
  });
};

export {
  register,
  login,
  logout,
  getProfile,
  forgotPassword,
  resetPassword,
  changePassword,
  updateUser,
};
