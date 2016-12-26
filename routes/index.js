var request = require('request');
var express = require('express');
var router = express.Router();

router.get("/", function(req, res){
	res.render("index");
});

router.get("/tickets", function(req, res){
	//make sure the the required data was passed in
	if(!req.query.user || !req.query.pass || !req.query.account)
		return res.status(400).json({
			code:1, 
			message:"Please supply a user login, password, and account name."
		});
	
	//get all of the tickets from zendesk	
	request({
		protocol: "https:",
		url: "https://"+req.query.account+".zendesk.com/api/v2/tickets.json",
		method: "get",
		auth: {
			username: req.query.user,
			password: req.query.pass
		},
	}, function(err, resp, body){
		if(err)
			res.status(500).json({
				code:2, 
				message:"An error occurred when contacting the zendesk api - " + err
			}); 
		else{
			//check for errors sent by zendesk
			var bodyObj = JSON.parse(body);
			if(bodyObj.error)
				res.status(500).json({
					code:3,
					message:"An error occurred when pulling your tickets down from zendesk - " + bodyObj.error
				});
		}
			res.status(200).send(body);
	});
});	

router.get("/auth", function(req, res){
	
	//make sure the the required data was passed in
	if(!req.query.user || !req.query.pass || !req.query.account)
		return res.status(400).json({
			code:1, 
			message:"Please supply a user login, password, and account name."
		});
	
	//send user auth details to zendesk to make sure they are valid
	request({
		protocol: "https:",
		url: "https://"+req.query.account+".zendesk.com/api/v2/users.json",
		method: "get",
		auth: {
			username: req.query.user,
			password: req.query.pass
		},
	}, function(err, resp, body){
		if(err)
			res.status(500).json({
				code:2, 
				message:"An error occurred when authenticating the user" + err
			}); 
		else
			//request was made successfully, check if the authentication went through
			if(JSON.parse(body).error){
				res.status(400).json({
					code:3,
					message:"Zendesk didn't authenticate your details, please input valid user details"
				});
			}
			//no error passed back from zendesk, valid user
			else{
				res.status(200).json({
					code:0, 
					message:"User details authentic"
				});
			}
			res.end();
	});
});

module.exports = router;
