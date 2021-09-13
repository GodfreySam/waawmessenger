//  Models
const Campaign = require('../models/Campaign');
const { isLoggedIn } = require('../middlewares/authorizations');
const passport = require('passport');
const express = require('express');
const randomstring = require('randomstring');
const router = express.Router();


// Router /campaign/create-campaign
// renders create-campaign page
router.get('/create-campaign',  isLoggedIn, async (req, res) => {
	try {
		res.render('createCampaign');
	} catch (err) {
		console.log(err);
	}
});

// Router /campaign/single-campaign
// renders create-campaign for a campaign with its unique URL
router.get('/campaign/single-campaign/:campaignId', isLoggedIn, async (req, res) => {
   try {
      const singleCampaign = await Campaign.findOne({ link: `http://localhost:5000/campaign/single-campaign${req.params.campaignId}` })
         .populate('user');

      if (!singleCampaign) {
         req.flash('error-message', 'Invalid campaign link');
         return res.redirect('/');
      }
      
      res.render('campaignMessage', { author: singleCampaign.user.fullName });
      
	} catch (err) {
		console.log(err);
	}
});

// Router /campaign/create-campaign
// handles create-campaign form data submission
 router.post('/create-campaign', isLoggedIn, async (req, res) => {
	try {
      let loggedInUser = req.user;

      let { title } = req.body;

      // Generate a unique link for each campaign using randomstring package;
      let campLink = `${req.headers.origin}/campaign/create-campaign/${randomstring.generate()}`;

      let newCampaign = new Campaign({
         title,
         user: loggedInUser._id,
         link: campLink,
      });

      await newCampaign.save();

      if (!newCampaign) {
         req.flash('error-message', 'An error occurred while creating campaign')
         return res.redirect('back');
      }

      req.flash('success-message', 'Campaign created successfully');
      return res.redirect('back');

	} catch (err) {
		console.log(err);
	}
});

module.exports = router;