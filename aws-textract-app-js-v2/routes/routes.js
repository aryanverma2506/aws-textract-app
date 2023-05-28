const express = require("express");
const router = express.Router();

const routesController = require("../controllers/routes-controller");

/* GET home page. */
router
  .route("/")
  .get(routesController.getIndex)
  .post(routesController.fileUpload);

router.post("/canvas-upload", routesController.canvasUpload);

module.exports = router;
