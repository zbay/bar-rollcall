'use strict';

var mongoose = require('mongoose');
var db = mongoose.connection;

var express = require('express');
var app = express();
var mongo = require('mongodb');
var bodyParser = require('body-parser');
var routes = require('./routes/index.js');
var session = require('express-session');
var dotenv = require('dotenv').load();
var passport = require('passport');

mongoose.connect('mongodb://localhost:27017/bar-rollcall', function (err, db)
//mongoose.connect(process.env.MONGOLAB_URI, function (err, db)
{
 if (err) {
      throw new Error('Database failed to connect!');
   } else {
      console.log('Successfully connected to MongoDB.');

app.use('/static', express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  isLoggedIn: false,
  lastQuery: null,
  loadLastStuff: null,
  userID: null
}));

app.set('view engine', 'jade');
app.set('views', __dirname + '/templates');

routes(app, passport); 

app.listen(process.env.PORT || 8080, function(){
	console.log("The frontend server is running on port 8080.");
}); //listen 8080
}
});