import path from "path";
import express from "express";
import morgan from "morgan";
import { fileURLToPath } from "url";

import routes from "./routes/routes.js";
import * as errorControllers from "./controllers/error-controllers.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "ejs");

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "./public")));
app.use(
  "/maps/public/javascripts",
  express.static(path.join(__dirname, "../maps/public/javascripts"))
);
app.use(
  "/src/public/javascripts",
  express.static(path.join(__dirname, "../src/public/javascripts"))
);

app.use("/", routes);

app.use((req, res, next) => {
  res.redirect("/");
});

app.use(errorControllers.errorOccurred);

export default app;
