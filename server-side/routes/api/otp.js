const express = require("express");
const router = express.Router();
const {
  getOtp
} = require("../../controllers/otp");


router.route("/").post(getOtp);

module.exports = router;
