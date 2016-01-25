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
                var barsList = [];
                var bars = data.businesses;
                console.log(bars);
                for(var i = 0; i < bars.length; i++){
                    barsList.push({"id": bars[i].id, "address": bars[i].location.address, "city": bars[i].location.city, "country": bars[i].location.country_code, "state": bars[i].location.state_code, "phone": bars[i].display_phone, "name": bars[i].name, "review1": bars[i].snippet_text, "barPage": bars[i].url});
                }
                res.json(barsList);
        })
        .catch(function (err) {
            console.error(err);
        });
        }
    });
}