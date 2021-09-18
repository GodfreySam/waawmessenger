//  Models
const Campaign = require("../models/Campaign");
const Message = require("../models/Message");
const express = require('express');
const router = express.Router();

// Router /message/create-message
// handles create-message form data submission
router.post('/create-message/:messageId', async (req, res) => {
let { message } = req.body;
	console.log(req.body);
	if (!message) {
		req.flash('error-message', 'Please enter a message');
		return res.redirect('/user/login');
	}

   let campaignExist = await Campaign.findOne({ _id: req.params.messageId });

   if (!campaignExist) {
      req.flash('error-message', 'No such campaign found');
      return res.redirect('back');
   }

   let newMessage = new Message({ message });

	await newMessage
		.save()
		.then((message) => {
         campaignExist.messages.push(message._id);
         campaignExist.save();
			req.flash('success-message', 'Message sent successfully');
			res.redirect('back');
		})
		.catch((error) => {
			if (error) {
				req.flash('error-message', error.message);
				res.redirect('/');
			}
      })
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