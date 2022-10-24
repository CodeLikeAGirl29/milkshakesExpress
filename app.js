const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes')
const cookieParser = require('cookie-parser');
const {requireAuth,checkUser} =require('./middleware/auth') 
const app = express();

app.use(express.json());
// middleware
app.use(express.static('public'));
app.use(cookieParser());
// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI = process.env.MONGODB_CONNECTION_STRING;
mongoose
	.connect(dbURI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
	})
  .then(() => console.log("MongoDB has been connected"))
  .catch((err) => console.log(err));

// routes
app.get("*", checkUser);
app.get("/", (req, res) => res.render("home"));
app.get("/milkshakes", requireAuth, (req, res) => res.render("milkshakes"));
app.use(authRoutes);

// Establishing the port
const PORT = process.env.PORT ||5000;
 
// Executing the server on given port number
app.listen(PORT, console.log(
  `Server started on port ${PORT}`));
