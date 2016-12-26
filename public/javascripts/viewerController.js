var app = angular.module('ticketViewer', ['ui.router']);

app.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {
		$stateProvider
			.state('overview', {
				url: '/tickets',
				templateUrl: '/overview.html',
				controller: 'ticketOverviewController'
			}).state('ticket', {
				url: '/tickets/:id',
				templateUrl: '/ticket.html',
				controller: 'ticketController'
			}).state('login', {
				url: '/login',
				templateUrl: '/login.html',
				controller: 'userAuthController'
			}).state('loginTest', {
				url: '/loginTest',
				templateUrl: '/loginTest.html',
				controller: 'userAuthController'
			}).state('overviewTest', {
				url: '/ticketsTest',
				templateUrl: '/overviewTest.html',
				controller: 'ticketOverviewController'
			});
	
		$urlRouterProvider.otherwise('login');
	}
]);

/**
 * Individual ticket control
 */
app.controller('ticketController',[
	'$scope',
	'$stateParams',
	'ticketFactory',
	function($scope, $stateParams, ticketFactory){
		//get the selected ticket ID from the uri
		//get the data of that ticket from the ticket factory
		$scope.ticket = ticketFactory.tickets[$stateParams.id];
	}
]);

/**
 * Ticket overview control
 */

app.factory('ticketFactory', [function(){
	var obj = {
		tickets:[]
	};
	return obj;
}]);

app.controller("ticketOverviewController",[
	"$scope",
	"$http",
	"ticketFactory",
	"userFactory",
	function($scope, $http, ticketFactory, userFactory){

		//tickets are held in a factory obj so that they persist through views
		$scope.tickets = ticketFactory.tickets;
		
		//user must be authenticated, if they arent then ask for login details
		$scope.user = userFactory.user;
		
		$scope.getTickets = function(){
			if($scope.user === undefined || !$scope.user.auth){
				$scope.error = "There is no active, authenticated user, please go back and login before proceeding.";
			}
			else{
				//asynch get tickets from the server 
				$http({
					url: "http://localhost:3000/tickets",
					method: "GET",
					params:{
						'user': $scope.user.name,
						'pass': $scope.user.pass,
						'account': $scope.user.accName
					}
				}).success(function(data, status, headers, config){
					//tickets retreived, add them to tickets container
					if(data.tickets !== undefined)
					{
						for(var i=0; i < data.tickets.length; i++)
						{
							$scope.tickets[data.tickets[i].id] = data.tickets[i];
						}
					}
					else
						$scope.error = "There was a problem in parsing your tickets from zendesk";
				}).error(function(data, status, headers, config){
					//display error that occurred
					$scope.error = data.message;
				});		
			}
		};
		
		$scope.test_InvalidUser = function(){
			var tempUser = angular.copy($scope.user);
			$scope.user = undefined;
			$scope.getTickets();
			
			//restore old user
			$scope.user = angular.copy(tempUser);
		};
	}
]);

/**
 * User authentication control
 */
app.factory('userFactory', [function(){
	var obj = {
		user:{
			name:"",
			pass:"",
			accName:"",
			auth:false
		}
	};
	return obj;
}]);

app.controller("userAuthController",[
	"$scope",
	"$http",
	"userFactory",
	function($scope, $http, userFactory){
		
		//user stored in factory so that it persists
		$scope.user = userFactory.user;
		
		//testing outputs linked to error
		$scope.emptyUserOutput = $scope.error;
		$scope.incorrectUserOutput = $scope.error;
		
		//check credentials against server to validate them
		$scope.checkLogin = function(){
		
			//fetch the user's credentials 
			$scope.user.name = $scope.usernameInput;
			$scope.user.pass = $scope.passwordInput;
			$scope.user.accName = $scope.accountInput;
			
			//testing outputs linked to error
		$scope.emptyUserOutput = $scope.error;
		$scope.incorrectUserOutput = $scope.error;
			
			//run ajax call to check creds
			$http({
				method:'GET',
				url:'http://localhost:3000/auth',
				params:{
					'user': $scope.user.name,
					'pass': $scope.user.pass,
					'account': $scope.user.accName
				}
			}).success(function(data, status, headers, config){
				//user credentials valid, reflect that in the user obj
				$scope.user.auth = true;
				
				//show success message and hide errors
				$scope.message = "User is authentic, proceed to the ticket view";
				$scope.error = null;

			}).error(function(data, status, headers, config){
				//user credentials invalid, reflect that in the user obj
				$scope.user.auth = false;
				
				//show fail message
				$scope.error = data.message;
				$scope.message = null;
			
			});
		};
		
		$scope.test_EmptyUser = function(){
			$scope.usernameInput = "";
			$scope.passwordInput = "";
			$scope.accountInput = "";

			$scope.checkLogin();
			
		};
		
		$scope.test_IncorrectUser = function(){
			$scope.usernameInput = "a";
			$scope.passwordInput = "b";
			$scope.accountInput = "c";

			$scope.checkLogin();
		};
	}
]);