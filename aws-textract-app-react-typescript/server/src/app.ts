import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
dotenv.config();

import cors from "./config/cors.js";
import routes from "./routes/routes.js";
import * as errorController from "./controllers/error-controllers.js";

const app = express();
const allowedOrigins = process.env["CLIENT_URLS"]
  ?.split(",")
  .map((url) => url.trim());

app.use(morgan("dev"));
app.use(express.json());
app.use(cors({ origin: allowedOrigins }));

app.use("/api", routes);

app.use(errorController.routeNotFound);
app.use(errorController.errorOccurred);

export default app;
