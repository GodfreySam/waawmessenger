//  Models
const Campaign = require('../models/Campaign');
const User = require('../models/User');
const Message = require('../models/Message');
const { isLoggedIn } = require('../middlewares/authorizations');
const passport = require('passport');
const express = require('express');
const randomstring = require('randomstring');
const router = express.Router();

// Router /campaign/create-campaign
// renders create-campaign page
router.get('/create-campaign', isLoggedIn, async (req, res) => {
	try {
		res.render('createCampaign');
	} catch (err) {
		console.log(err);
	}
});

// Router /campaign/single-campaign
// renders create-campaign page for a campaign with its unique URL
router.get('/single-campaign/:campaignId', async (req, res) => {
	try {
		const singleCampaign = await Campaign.findOne({
			link: `http://localhost:5000/campaign/single-campaign/${req.params.campaignId}`,
		}).populate('user');

		if (!singleCampaign) {
			req.flash('error-message', 'Invalid campaign link');
			return res.redirect('/');
		}

		res.render('campaignMessage', { singleCampaign });
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
      let campLink = `${req.headers.origin}/campaign/single-campaign/${randomstring.generate()}`;

		let newCampaign = new Campaign({
			title,
			user: loggedInUser._id,
			link: campLink,
		});

		await newCampaign.save();

		if (!newCampaign) {
			req.flash('error-message', 'An error occurred while creating campaign');
			return res.redirect('back');
		}

		req.flash('success-message', 'Campaign created successfully');
		return res.redirect('back');
	} catch (err) {
		console.log(err);
	}
});



// Delete messages
// router.get('/campaign-message/:campaignId', async (req, res) => {
// 	let { campaignId } = req.params;

// 	let deletedMsg = await Message.findByIdAndDelete({ campaignId });
// 	if (!deletedMsg) {
// 		req.flash('success-message', 'campaign message deleted');
// 		res.redirect('back');
// 	}
// })

module.exports = router;
