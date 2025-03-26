const express = require("express");
const { signup, signin, logout, deleteUser, updateUserProfile } = require("../controllers/user.auth.controller");
const { authenticate, isAdmin } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/logout", authenticate, logout);
router.delete("/user/:id", authenticate, isAdmin, deleteUser);
router.put("/user/profile", authenticate, updateUserProfile);

module.exports = router;
