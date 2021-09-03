const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const Message = require("./models/Message");

// DB Connection
mongoose.connect('mongodb://localhost/waawmessenger')
   .then((dbconnect) => console.log('DB connected successfully ::::::::'))
   .catch((error) => console.log('DB connection error:', error.message));

const app = express();

// SETTING UP EXPRESS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.locals.moment = require('moment');

app.get("/", async (req, res, next) => {
   try {
      let allmessages = await Message.find({}).sort({ _id: -1 });

         res.render('index', { messages: allmessages });

   } catch (err) {
      console.log(err)
   }
});

app.post("/message/create-message", (req, res, next) => {
   let { message } = req.body;

   if (!message) {
     return res.redirect('/');
   }

   let newMessage = new Message({
      message
   });

   newMessage.save()
      .then((data) => console.log('Message created successfully', data))
      .catch((error) => console.log('Error creating message', error));
   
   res.redirect('/');

});


const port = process.env.PORT || 5000;

app.listen(port, ()=> console.log(`server running on port:: ${port}`));