const express = require("express"),
  router = express.Router(),
  PageController = require("../controllers/PageController");

router.get("/", PageController.main);
module.exports = router;
