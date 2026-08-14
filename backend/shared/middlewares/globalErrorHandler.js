import { AppError } from "../errors/app-error.js";

export const globalErrorHandler = (err, req, res, next) => {
  const error = err instanceof AppError
    ? err
    : new AppError("Something went wrong", 500, false);

  if (!error.isOperational) {
    console.error("UNEXPECTED ERROR 💥", err);
  }

  return res.status(error.statusCode).json({
    success: false,
    message: error.isOperational
      ? error.message
      : "Something went wrong",
    data: null,
  });
};