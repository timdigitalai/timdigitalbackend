const express = require("express");
const { signup, login, logout, updateProfile, changePassword, deleteAccount, getAllBusinesses } = require("../controllers/admin.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { isAdmin } = require("../middleware/isAdmin");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", authenticate, isAdmin, logout);
router.put("/update-profile", authenticate, isAdmin, updateProfile);
router.put("/change-password", authenticate, isAdmin, changePassword);
router.delete("/delete-account", authenticate, isAdmin, deleteAccount);
router.get("/businesses", authenticate, isAdmin, getAllBusinesses);

module.exports = router;
