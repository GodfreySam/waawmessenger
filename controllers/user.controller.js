//  Models
const Message = require('../models/Message');
const User = require('../models/User');
const Campaign = require('../models/Campaign');
const auth = require('../middlewares/authorizations');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const express = require('express');
const { isLoggedIn } = require('../middlewares/authorizations');
const router = express.Router();

// Router /user/register
// renders user/register page
router.get('/register', async (req, res) => {
	try {
		res.render('register');
	} catch (err) {
		console.log(err);
	}
});

// Router /user/register
// handles /user/register form data submission
router.post('/register', async (req, res) => {
	try {
		const { email, fullName, password, confirmPassword } = req.body;

		if (password !== confirmPassword) {
			req.flash('error-message', 'Passwords do not match');
			return res.redirect('back');
		}

		let userExists = await User.findOne({ email });

		if (userExists) {
			req.flash('error-message', 'Email aleady exist!');
			return res.redirect('back');
		}

		const salt = await bcrypt.genSalt();
		const hashedPassword = await bcrypt.hash(password, salt);

		let newUser = new User({
			email,
			fullName,
			password: hashedPassword,
		});

		await newUser.save();

		if (!newUser) {
			req.flash('error-message', 'Something went wrong, please try again');
			return res.redirect('back');
		}

		req.flash('success-message', 'Registration successful, you can now login');
		return res.redirect('/user/login');
	} catch (err) {
		console.log(err);
	}
});

// Router /user/login
// renders user/login page
router.get('/login', (req, res) => {

	// if user is already logged in
	if (req.user) return res.redirect('/user/profile');
	
	// if no user is logged in
	res.render('login');
});

// Router /user/login
// renders login page for onboarding user
// router.get('/', (req, res) => {
// 	res.redirect('/user/login');
// });

// Router /user/profile
// renders /user/profile page
router.get('/profile', isLoggedIn, async (req, res) => {
	try {
		let userCampaigns = await Campaign.find({ user: req.user }).populate('user messages');
		res.render('profile', { userCampaigns });
	} catch (err) {
		console.log(err);
	}
});

// Router /user/logout
// renders /user/logout page after user is logged out 
router.get('/logout', (req, res) => {
	req.logout();
	req.flash('success-message', 'User Logged out');
	res.redirect('/user/login');
});

// Router /user/login
// handles user login using passport controll password management
// and user login 
router.post(
	'/login',
	passport.authenticate('local', {
		successRedirect: '/user/profile',
		failureRedirect: '/user/login',
		failureFlash: true,
		successFlash: true,
		session: true,
	}),
);

module.exports = router;
