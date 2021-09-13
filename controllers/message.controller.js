//  Models
const Message = require('../models/Message');
const express = require('express');
const router = express.Router();

// Router /message/create-message
// handles message form data submission
router.post('/create-message', async (req, res, next) => {
	let { message } = req.body;
	
	if (!message) {
		req.flash('error-message', 'Please enter a message');
		return res.redirect('/');
	}

	let newMessage = new Message({
		message,
	});

	await newMessage
		.save()
		.then((data) => {
			console.log('Message created successfully');

			req.flash('success-message', 'Message created successfully');
			res.redirect('/');
		})
		.catch((error) => {
			if (error) {
				req.flash('error-message', error.message);
				res.redirect('/');
			}
		});
});

//  Delete Messages
// Router /message/delete-message
// handles message deletion using messageId in req.params
router.get('/delete-message/:messageId', async (req, res, next) => {
	try {
		const { messageId } = req.params;
		const deletedMessage = await Message.findOneAndDelete({ messageId });

		if (!deletedMessage) {
			req.flash('error-message', 'Message was not deleted');
			return res.redirect('back');
		}

		req.flash('success-message', 'Message deleted successfully');
		res.redirect('/');
	} catch (err) {
		console.log(err);
	}
});

module.exports = router;