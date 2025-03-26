const express = require("express");
const { signupTraveller } = require("../controllers/travel.controller");

const router = express.Router();

router.post("/signup", signupTraveller);

module.exports = router;
