var app = angular.module('ticketViewer', ['ui.router']);

app.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {
		$stateProvider
			.state('overview', {
				url:'/overview',
				templateUrl:'/overview.html',
				controller:'ticketOverviewController'
			}).state('login', {
				url:'/login',
				templateUrl:'/login.html',
				controller:'userAuthController'
			});
	
		$urlRouterProvider.otherwise('login');
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
	"$state",
	"ticketFactory",
	"userFactory",
	function($scope, $http, $state, ticketFactory, userFactory){

		//tickets are held in a factory obj so that they persist through views
		$scope.tickets = ticketFactory.tickets;
		
		//user must be authenticated, if they arent then ask for login details
		var user = userFactory.user;
		if(!user.auth)
			$state.go('login');
		else
		{
			//asynch get tickets from the server 
			$http({
				url: "http://localhost:3000/tickets",
				method: "GET",
				params:{
					'user': user.name,
					'pass': user.pass,
					'account': user.accName
				}
			}).success(function(data, status, headers, config){
				//tickets retreived, add them to tickets container
				if(data.tickets !== undefined)
				{
					for(var i=0; i < data.tickets.length; i++)
					{
						$scope.tickets.push(data.tickets[i]);
					}
				}
			}).error(function(data, status, headers, config){
				//display error that occurred
				$scope.error = data.message;
			});		
		}
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
	"$state",
	"userFactory",
	function($scope, $http, $state, userFactory){		
		//user stored in factory so that it persists
		$scope.user = userFactory.user;
			
		//check credentials against server to validate them
		$scope.checkLogin = function(){
			//fetch the user's credentials 
			$scope.user.name = $scope.usernameInput;
			$scope.user.pass = $scope.passwordInput;
			$scope.user.accName = $scope.accountInput;
			
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
				
				//change state to tickets view
				$state.go('overview');
				
			}).error(function(data, status, headers, config){
				//user credentials invalid, reflect that in the user obj
				$scope.user.auth = false;
			});
		};
	}
]);