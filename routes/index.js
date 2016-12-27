var request = require('request');
var express = require('express');
var router = express.Router();

router.get("/", function(req, res){
	res.render("index");
});

router.get("/tickets", function(req, res){
	//make sure the the required data was passed in
	if(!req.query.user || !req.query.pass || !req.query.account){
		return res.status(400).json({
			code:1, 
			message:"Please supply a user login, password, and account name."
		});
	}
	else{
		//if no ID was passed in, then request all tickets -controlled by URL
		var url = "https://"+req.query.account+".zendesk.com/api/v2/tickets";

		if(req.query.id)
			url += "/"+req.query.id;

		//complete URL with .json
		url += ".json";

		//get ticket(s) from zendesk	
		request({
			protocol: "https:",
			url: url,
			method: "get",
			auth: {
				username: req.query.user,
				password: req.query.pass
			},
		}, function(err, resp, body){
			if(err)
				return res.status(500).json({
					code:2, 
					message:"An error occurred when contacting the zendesk api - " + err
				}); 
			else{
				//check for errors sent by zendesk
				var bodyObj = JSON.parse(body);
				if(bodyObj.error){
					return res.status(500).json({
						code:3,
						message:"An error occurred when pulling your tickets down from zendesk - " + bodyObj.error
					});
				}
				else
					return res.status(200).json({
						code:0,
						body:bodyObj
					});
			}
		});
	}
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

function requestTickets(user, pass, account, id)
{
	if(!user || !pass || !account){
		return {
			code:1,
			message:"Please provide a valid username, password, and account name to retrieve tickets."
		};
	}
	
}

module.exports = router;
