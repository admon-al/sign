const express = require("express"),
  router = express.Router(),
  utils = require("../utils"),
  SignController = require("../controllers/SignController");

router.get("/url", SignController.url);
router.post("/text", SignController.text);
router.post("/file", utils.upload, SignController.file);

module.exports = router;
