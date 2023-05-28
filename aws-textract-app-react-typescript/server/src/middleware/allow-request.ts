import { RequestHandler } from "express-serve-static-core";

export const allowRequest: RequestHandler = async (req, res, next) => {
  if (process.env["ALLOW_REQUESTS"]?.toLowerCase() === "allow") {
    return next();
  } else {
    return res.status(403).json({
      message:
        "The server is currently down and will be operational once you make a request to the creator Aryan",
    });
  }
};
