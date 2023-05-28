import { Router } from "express";

const router = Router();

import * as routeControllers from "../controllers/route-controllers.js";

router
  .route("/")
  .get(routeControllers.getIndex)
  .post(routeControllers.canvasUpload);

export default router;
