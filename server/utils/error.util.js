
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;


// Converting a class-based error to a functional approach in JavaScript is unconventional because error handling typically relies on classes to maintain prototype chains and inheritance properties. However, you can achieve similar behavior using a factory function. Here's how you can do it:
// corresponding funtional component
// function createAppError(message, statusCode) {
//   const error = new Error(message);
//   error.statusCode = statusCode;
//   Error.captureStackTrace(error, createAppError);
//   return error;
// }

// export default createAppError;
