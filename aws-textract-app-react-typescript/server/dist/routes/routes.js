import { Router } from "express";
const router = Router();
import * as routeControllers from "../controllers/route-controllers.js";
import { allowRequest } from "../middleware/allow-request.js";
router.route("/").post(allowRequest, routeControllers.canvasUpload);
export default router;
