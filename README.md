# Zenviewer
A simple ticket viewer for the zendesk ticket API. This web-application allows users to quickly set up a viewer for the Zendesk ticket API.

## About
Author: Matthew Grey
Server-side: Express.js (Node.js)
Front-end: Angular.js

## Installation
### Requirements
The application utilises the following technologies:
	
	- NPM
	- Node.js
	- Express.js
	- Angular.js
	- SASS precompiler

### Process
Follow the following steps to run the application:
	
	- Place the application folder in the desired directory.
 	
	- Execute npm install to install any outstanding technologies that are required by the application.
	
	- Execute npm start in the base application folder to start the server.
	
	- Access the running server by navigating to localhost:3000 in a browser.

## Usage
The workflow of the viewer is as follows:

	- User authenticates API login details that are to be used to access the API
	
	- On successful authentication, user proceeds to the ticket overview and requests tickets from the server
	- The user will be delivered a list of their current tickets, displayed in pages of 100 tickets. The may be navigated with the arrow buttons at the top of the list.
	
	- More details can be displayed for a ticket by clicking on either the ticket's ID or subject. This will take the user into the detailed view, where they can see more details of the ticket and return to the overview.
	
	- If users desire to log into a different account, they can return to the login page by clicking on the link in the navigation bar at the top of the page. Once on the login page, they can log out and begin the workflow again.
	
## Testing
Tests are included to test the front-end and server-side functionality.

The front-end functionality may be tested on designated test views. These are accessible as follows:

	- User Authentication Testing: localhost:3000/#/loginTest
	
	- Ticket testing: localhost:3000/#/ticketsTest
	
The server-side functionality may be tested by using the bash scripts included in ~/tests . These are used as follows to test the interaction between the server and the zendesk API:

	- User Authentication Testing: execute test_users.sh in the terminal. You may pass the username, password, and account-name as parameters. If they are not passed as parameters, the script will prompt you for them.
	
	- Ticket Testing: execute test_tickets.sh in the terminal. You may pass the username, password, and account-name as parameters. If they are not passed as parameters, the script will prompt you for them.