
const errorMiddleware = (err, req, res, next) => {
    console.log(err);
    res.status(err.statusCode || 500).json({
        success: false,
        status: err.status || 'error',
        message: err.message,
        stack: err.stack,
    });
}

export default errorMiddleware;