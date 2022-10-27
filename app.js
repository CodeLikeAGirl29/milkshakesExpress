const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes.js');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middleware/auth.js');

dotenv.config();
const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI = process.env.MONGODB_URI;
mongoose
	.connect(dbURI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
	})
	.then((result) =>
		app.listen(process.env.PORT || 5000, () => {
			console.log('port 5000 running');
		})
	)
	.catch((err) => console.log(err));

// routes
app.get('*', checkUser); //apply check user middleware to every single get request and shows user in the header
app.use(authRoutes);
app.get('/', (req, res) => res.render('home'));
app.get('/milkshakes', requireAuth, (req, res) => res.render('milkshakes'));
