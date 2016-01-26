module.exports = function (app, passport) {
var request = require('request');
var baseYelpURL = "https://api.yelp.com/v2/term=bar&location=";
var Yelp = require('yelp');
var dotenv = require("dotenv");
var mongoose = require("mongoose");
var Attendance = require("../dbmodels/attendance");
var async = require('async');
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
            res.render("main", {loggedIn: req.session.isLoggedIn, loadLastStuff: req.session.loadLastStuff, lastQuery: req.session.lastQuery});
    });

    app.post("/search", function(req, res){
        //console.log(req.body.localeInput);
        req.session.lastQuery = req.body.localeInput;
        if(req.body.localeInput.length){
            yelp.search({ term: 'bar', location: req.body.localeInput, limit: 20})
            .then(function (data) {
                var barsList = [];
                var bars = data.businesses;
                async.each(bars, appendBar, returnBars);
                
                function appendBar(bar, callback){
                                        var attendeesNum;
                    Attendance.findOne({"barID": bar.id}, function(err, msg){
                        if(msg){
                            attendeesNum = msg.attendees.length;
                        }
                        else{
                            attendeesNum = 0;
                        }
                        barsList.push({"id": bar.id, "address": bar.location.address, "city": bar.location.city, 
                         "country": bar.location.country_code, "state": bar.location.state_code, 
                         "phone": bar.display_phone, "name": bar.name, "review1": bar.snippet_text, "barPage": bar.url, "attendeesNum": attendeesNum});
                         return callback();
                });
        
                }
                function returnBars(){
                  res.json(barsList);   
                }
        })
        .catch(function (err) {
            console.error(err);
        });
        }
    });
    app.post("/checkIn", function(req, res){
        var theBar = req.body.barID;
        if(req.session.isLoggedIn){
        Attendance.find({"barID": theBar}, function(err, data){
            //console.log(data);
            if(data.length == 0){
                  var newAttendance = new Attendance({"barID": req.body.barID});
            newAttendance.save(function(err, message){
                if(!err){
                  Attendance.update({"barID": theBar}, {$addToSet: {"attendees": req.session.userID}}, function(err, data){
                      //console.log(data);
                      res.json({"success": true});
                  });   
                }
                else{
                 res.json("success", false);   
                }
        });
            }
            else{
                 Attendance.update({"barID": theBar}, {$addToSet: {"attendees": req.session.userID}}, function(err, data){
                     //console.log(data);
                 });   
                 res.json({"success": true});
            }
        });  
        }
        else{
            req.session.loadLastStuff = true;
            res.json({"redirect": "/auth/twitter"});
        }

    });
    
    
var passportTwitter = require('../auth/twitter');

app.get('/auth/twitter', passportTwitter.authenticate('twitter'));

app.get('/auth/twitter/return',
  passportTwitter.authenticate('twitter', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication
    req.session.isLoggedIn = true;
    req.session.userID = req.user._id;
    res.redirect("/");
    //res.json(req.user);
  });
}