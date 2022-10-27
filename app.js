/////////////////////////////////////////////
// Import Our Dependencies
/////////////////////////////////////////////
require("dotenv").config()
const express = require('express');
const morgan = require("morgan");
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const methodOverride = require("method-override")
const authRoutes = require('./routes/authRoutes.js');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middleware/auth.js');

const app = express();

/////////////////////////////////////////////////////
// Middleware
/////////////////////////////////////////////////////
app.use(morgan("tiny")) //logging
app.use(methodOverride("_method")) // override for put and delete requests from forms
app.use(express.urlencoded({extended: true})) // parse urlencoded request bodies
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set('view engine', 'ejs');

/////////////////////////////////////////////
// Database Connection
/////////////////////////////////////////////
const dbURI = process.env.MONGODB_URI;
const CONFIG = {
	useNewUrlParser: true,
	useUnifiedTopology: true
}

// Establish Connection
mongoose.connect(dbURI, CONFIG)
// mongoose
// 	.connect(dbURI, {
// 		useNewUrlParser: true,
// 		useUnifiedTopology: true,
// 		useCreateIndex: true,
// 	})
// 	.then((result) =>
// 		app.listen(process.env.PORT || 5000, () => {
// 			console.log('port 5000 running');
// 		})
// 	)
// 	.catch((err) => console.log(err));
// Events for when connection opens/disconnects/errors
mongoose.connection
.on("open", () => console.log("Connected to Mongoose"))
.on("close", () => console.log("Disconnected from Mongoose"))
.on("error", (error) => console.log(error))

//////////////////////////////////////////////
// Routes
//////////////////////////////////////////////
app.get('*', checkUser); //apply check user middleware to every single get request and shows user in the header
app.use(authRoutes);
app.get('/', (req, res) => res.render('home'));
app.get('/milkshakes', requireAuth, (req, res) => res.render('milkshakes'));

//////////////////////////////////////////////
// Server Listener
//////////////////////////////////////////////
const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Now Listening on port ${PORT}`))