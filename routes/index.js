module.exports = function (app, passport) {
var request = require('request');
var baseYelpURL = "https://api.yelp.com/v2/term=bar&location=";
var Yelp = require('yelp');
var dotenv = require("dotenv");
var yelp = new Yelp({
  consumer_key: process.env.YELP_CONSUMER_KEY,
  consumer_secret: process.env.YELP_CONSUMER_SECRET,
  token: process.env.YELP_TOKEN,
  token_secret: process.env.YELP_TOKEN_SECRET
});

    function isLoggedIn (req, res, next) {
		if (req.session.loggedIn) {
			return next();
		} else {
			res.redirect('/unlogged');
		}
	}
    app.get("/", function(req, res){
            res.render("main", {loggedIn: req.session.isLoggedIn});
    });
    app.get("/login", function(req, res){
            if(req.session.isLoggedIn){
                res.redirect("/");
            }
            else{
                res.render("login");
            }
        });
    app.post("/login", function(req, res){
         if(req.session.isLoggedIn){
                res.redirect("/");
            }
            else{
                
            }
    });
    app.post("/search", function(req, res){
        console.log(req.body.localeInput);
        if(req.body.localeInput.length){
            yelp.search({ term: 'bar', location: req.body.localeInput, limit: 20})
            .then(function (data) {
                var bars = [];
                for(var i = 0; i < data.length; i++){
                    
                }
               // console.log(data.businesses);
                res.json(data.businesses);
        })
        .catch(function (err) {
            console.error(err);
        });
        }
    });
}