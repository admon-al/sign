const express = require("express"),
  router = express.Router(),
  utils = require("../utils"),
  VerifyController = require("../controllers/VerifyController");

router.get("/url", VerifyController.url);
router.post("/text", VerifyController.text);
router.post("/file", utils.upload, VerifyController.file);

module.exports = router;
