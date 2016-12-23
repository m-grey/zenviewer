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
			res.status(400).json({
				code:2, 
				message:"An error occurred when contacting the zendesk api - " + err
			}); 
		else
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
			res.status(400).json({
				code:2, 
				message:"An error occurred when authenticating the user" + err
			}); 
		else
			res.status(200).json({
				code:0, 
				message:"User details authentic"
			});
			res.end();
	});
});

module.exports = router;
