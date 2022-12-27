'use strict';

const API_ADDRESS = 'http://127.0.0.1:8080';

angular.module('app', ['ngRoute', 'ngResource', 'ngCookies'])
	.config(function($routeProvider) {
		$routeProvider
		.when('/', {
				templateUrl: 'partials/main.html',
				controller: 'MainController',
				controllerAs: 'mainCtrl'
			})
			.when('/receipt', {
				templateUrl: 'partials/receipt.html',
				controller: 'ReceiptController',
				controllerAs: 'receiptCtrl'
			})		
			.when('/transfer', {
			templateUrl: 'partials/transfer.html',
			controller: 'TransferController',
			controllerAs: 'transferCtrl'
			})
			.when('/register', {
				templateUrl: 'partials/register.html',
				controller: 'RegisterController',
				controllerAs: 'registerCtrl'
			})			
			.when('/login', {
				templateUrl: 'partials/login.html',
				controller: 'LoginController',
				controllerAs: 'loginCtrl'
			})
			.when('/balance', {
				templateUrl: 'partials/balance.html',
				controller: 'BalanceController',
				controllerAs: 'balanceCtrl'
			})
			.when('/info', {
				templateUrl: 'partials/info.html',
				controller: 'InfoController',
				controllerAs: 'infoCtrl'
			})
			.otherwise({
				redirectTo: '/'
			});
	})
	.factory('User', function($resource) {
		return $resource(API_ADDRESS+'/api/register');
	})
	.factory('ReceiptsLatest', function($resource) {
		return $resource(API_ADDRESS+'/api/receipt/recent');
	})
	.factory('ReceiptsWithoutTransfer', function($resource) {
		return $resource(API_ADDRESS+'/api/receipt/no_transfer_receipts');
	})
	.factory('Receipt', function($resource) {
		return $resource(API_ADDRESS+'/api/receipt');
	})
	.factory('TransfersLatest', function($resource) {
		return $resource(API_ADDRESS+'/api/transfer/recent');
	})
	.factory('Transfer', function($resource) {
		return $resource(API_ADDRESS+'/api/transfer');
	})
	.factory('Balance', function($resource) {
		return $resource(API_ADDRESS+'/api/balance/current');
	})
	.config(function($httpProvider) {
		$httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
	})	
	.run(['$rootScope', '$cookies', '$http',
    function ($rootScope, $cookies, $http) { 
		if ($cookies.get('globals')) {
            $http.defaults.headers.common['Authorization'] = $cookies.get('globals');
			$rootScope.currentUserName = $cookies.get('currentUserName');
			$rootScope.authenticated = true;
        }
    }]);



