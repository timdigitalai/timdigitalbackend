const express = require("express");
const {
  registerBusiness,
  getAllBusinesses,
  getBusinessById,
  updateBusiness,
  deleteBusiness,
  uploadBusinessImages,
  addBusinessContact,
} = require("../controllers/business.controller");
const { authenticate, isAdmin } = require("../middleware/auth.middleware");
const upload = require("../utils/upload");

const router = express.Router();

router.post("/", authenticate, isAdmin, registerBusiness);
router.get("/", getAllBusinesses);
router.get("/:id", getBusinessById);
router.put("/:id", authenticate, isAdmin, updateBusiness);
router.delete("/:id", authenticate, isAdmin, deleteBusiness);
router.post("/:id/images", authenticate, isAdmin, upload.array("images", 5), uploadBusinessImages);
router.post("/:id/contact", authenticate, isAdmin, addBusinessContact);

module.exports = router;
