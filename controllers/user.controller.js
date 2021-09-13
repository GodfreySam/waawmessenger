//  Models
const User = require('../models/User');
const auth = require('../middlewares/auth');
const passport = require('passport');
const express = require('express');
const router = express.Router();


// User Registration
router.get('/register', async (req, res) => {
	try {
		res.render('register');
	} catch (err) {
		console.log(err);
	}
});

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

router.get('/login', (req, res) => {
	res.render('login');
});

router.get('/profile', auth, (req, res) => {
	res.render('profile');
});

router.get('/logout', (req, res) => {
	req.logout();
	req.flash('success-message', 'User Logged out');
	res.redirect('/user/login');
});

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