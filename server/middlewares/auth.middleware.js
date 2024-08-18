import AppError from "../utils/error.util.js";

import jwt from "jsonwebtoken";

const isLoggedIn = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return next(new AppError("Please login to access this resource", 401));
    }

    const userDetails = await jwt.verify(token, process.env.JWT_SECRET);
    // console.log("User Details:", userDetails); // Log user details for debugging

    if (!userDetails.role) {
      return next(new AppError("User role not found in token", 401));
    }

    req.user = userDetails;

    next();
  } catch (error) {
    next(new AppError("Invalid token", 401));
  }
};

const authorizedRoles = (...roles) => async (req, res, next) => {
    try {
      if (!req.user || !req.user.role) {
        return next(new AppError("User role not found", 401));
      }

      const currentUserRole = req.user.role;
      if (!roles.includes(currentUserRole)) {
        return next(
          new AppError("You are not authorized to access this resource", 403)
        );
      }

      next();
    } catch (error) {
      next(error);
    }
}

const authorizeSubscriber = async (req, res, next) => {
  const subscription = req.user.subscription;
  const currentUserRole = req.user.role; // await User.findById(req.user.id);
  if (currentUserRole !== "ADMIN" || subscription.status !== "active") {  // &&
    return next(new AppError("Please subscribe to access this resource", 403));
  }
}

export {
    isLoggedIn, authorizedRoles,authorizeSubscriber
}

