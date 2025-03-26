const Business = require('../models/Business');

exports.getPendingBusinesses = async (req, res) => {
  try {
    const businesses = await Business.find({ status: 'pending' });
    res.status(200).json({ success: true, data: businesses });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.approveBusiness = async (req, res) => {
  try {
    const business = await Business.findByIdAndUpdate(req.params.id, { status: 'approved' }, { new: true });
    if (!business) return res.status(404).json({ success: false, message: 'Business not found' });

    res.status(200).json({ success: true, message: 'Business approved successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.rejectBusiness = async (req, res) => {
  try {
    const business = await Business.findByIdAndUpdate(req.params.id, { status: 'rejected' }, { new: true });
    if (!business) return res.status(404).json({ success: false, message: 'Business not found' });

    res.status(200).json({ success: true, message: 'Business rejected successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.deleteBusiness = async (req, res) => {
  try {
    const business = await Business.findByIdAndDelete(req.params.id);
    if (!business) return res.status(404).json({ success: false, message: 'Business not found' });

    res.status(200).json({ success: true, message: 'Business deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
