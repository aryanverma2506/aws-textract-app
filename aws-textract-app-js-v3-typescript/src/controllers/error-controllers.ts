import { ErrorRequestHandler } from "express-serve-static-core";

export const errorOccurred: ErrorRequestHandler = async (
    error,
    req,
    res,
    next
  ) => {
    if (res.headersSent) {
      return next(error);
    }
    return res
      .status(error.code || 500)
      .json({ message: error.message || "An unknown error occurred!" });
  };