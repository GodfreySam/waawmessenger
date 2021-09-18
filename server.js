const { globalVariables } = require('./middlewares/configuration');
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');
const logger = require('morgan');
const dotenv = require('dotenv');
const passport = require('passport');
const connectDB = require('./configs/db.config');
// const { isLoggedIn } = require('./middlewares/authorizations');

// Controllers
const indexController = require('./controllers/index.controller');
const userController = require('./controllers/user.controller');
const messageController = require('./controllers/message.controller');
const campaignController = require('./controllers/campaign.controller');

//  Load environment configs
dotenv.config({ path: "./configs/config.env" });

// Passport config
require('./configs/passport.config')(passport);

// Middleware
const auth = require('./middlewares/authorizations');

//  Models
const Message = require('./models/Message');
const User = require('./models/User');

// DB Connection
connectDB();

// Call express app
const app = express();

// SETTING UP EXPRESS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// express-session
app.use(cookieParser());
app.use(
	session({
		secret: 'secret*up-and-down',
		resave: true,
		saveUninitialized: true,
		cookie: {
			maxAge: Date.now() + 60000,
		},
		store: MongoStore.create({
			mongoUrl: process.env.MONGO_URI,
		}),
	}),
);

// Initialize Passport and it session wares
app.use(passport.initialize());
app.use(passport.session());

// Log app and router activities to the terminal
// for dev and debugging purpose
app.use(logger('dev'));

// Initialize Flash for flash messages
app.use(flash());

// Use Global Variables
app.use(globalVariables);
app.locals.moment = require('moment');

// Set views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// assign port to a variable
const port = process.env.PORT || 5000;

// listen for server connections
app.listen(port, () => console.log(`server running on port:: http://localhost:${port}`));

// Expose the routes using the controllers and router entry
app.use('/', indexController);
app.use('/user', userController);
app.use('/message', messageController);
app.use('/campaign', campaignController);