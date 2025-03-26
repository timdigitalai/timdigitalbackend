const Business = require('../models/model.business');
const Share = require('../models/Share');

exports.shareBusiness = async (req, res) => {
  try {
    const { businessId, platform } = req.body;

    const business = await Business.findById(businessId);
    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'Business not found'
      });
    }

    let shareUrl;
    const businessUrl = `${process.env.FRONTEND_URL}/business/${business._id}`;
    const text = encodeURIComponent(`Check out ${business.name} on our platform!`);

    switch (platform.toLowerCase()) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(businessUrl)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(businessUrl)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(businessUrl)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://api.whatsapp.com/send?text=${text}%20${encodeURIComponent(businessUrl)}`;
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Unsupported sharing platform'
        });
    }

    await new Share({
      businessId: business._id,
      platform: platform.toLowerCase(),
      userId: req.user ? req.user.id : null,
    }).save();

    res.status(200).json({
      success: true,
      shareUrl,
      business: {
        id: business._id,
        name: business.name,
        description: business.description
      }
    });
  } catch (error) {
    console.error('Share business error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sharing business',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
