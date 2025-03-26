const express = require('express');
const router = express.Router();
const { isAdmin } = require('../../middlewares/auth.middleware');
const {
  getPendingBusinesses,
  approveBusiness,
  rejectBusiness,
  deleteBusiness,
} = require('../../controllers/admin.controller');

router.get('/businesses/pending', isAdmin, getPendingBusinesses);
router.put('/businesses/:id/approve', isAdmin, approveBusiness);
router.put('/businesses/:id/reject', isAdmin, rejectBusiness);
router.delete('/businesses/:id', isAdmin, deleteBusiness);

module.exports = router;
