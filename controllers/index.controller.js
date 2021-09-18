const Message = require('../models/Message');

const express = require('express');
const router = express.Router();

router.get('/', async (req, res, next) => {
	try {
		// let allmessages = await Message.find({}).sort({ _id: -1 });

		res.redirect('/user/login');

	} catch (err) {
		console.log(err);
	}
});

module.exports = router;