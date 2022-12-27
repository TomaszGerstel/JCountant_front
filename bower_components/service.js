'use strict';

angular.module('app')
	.service('ReceiptService', function(ReceiptsLatest, Receipt, ReceiptsWithoutTransfer) {
		var vm = this;
		vm.receipt = new Receipt();		
		vm.getLatestReceipts = function() {
			return ReceiptsLatest.query({ },
				function success(data) {
					console.log('Pobrano dane: ' + JSON.stringify(data));		
				},
				function error(response) {
					console.log(response.status);
				});
		}
		vm.addReceipt = function(receipt, successCallback) {
			vm.receipt = receipt;			
			vm.receipt.$save(function(data) {
				console.log('New receipt added: ' + JSON.stringify(data));
				successCallback();
				vm.receipt = new Receipt();	
			},
			function error(reason) {
				console.log('adding receipt error: ' + reason);
			})
		}; 
		vm.getReceiptsWithoutTransfer = function() {
			return ReceiptsWithoutTransfer.query({ }, 
				function success(data) {
					console.log('Data downoladed: ' + JSON.stringify(data));		
				},
				function error(response) {
					console.log(response.status);
				});
		}
		vm.deleteReceipt = function(id, successCallback) {
			vm.receipt.$delete({ receiptId: id })
			.then(function success() {
				console.log('Receipt deleted');
				successCallback();
			},
				function error(reason) {
					console.log('deleting receipt error' + reason);
				});
		}	
	})	
	.service('TransferService', function(TransfersLatest, Transfer) {
		var vm = this;
		vm.transfer = new Transfer();
		vm.getLatestTransfers = function() {
			return TransfersLatest.query({ },
				function success(data) {
					console.log('Data downloaded: ' + JSON.stringify(data));
				},
				function error(reponse) {
					console.log(reponse.status);
				});
		}
		vm.addTransfer = function(transfer, receiptId, successCallback) {
			vm.transfer = transfer;
			vm.transfer.$save({receiptId: receiptId}, function(data) {
				console.log('New transfer added: ' + JSON.stringify(data));
				successCallback();
				vm.transfer = new Transfer();
		},
		function error(reason) {
			console.log('adding transfer error: ' + reason);
		})

	}; 

	})
	.service('BalanceService', function(Balance) {
		var vm = this;
		vm.getCurrentBalance = function() {
			return Balance.get({ }, function success(data) {
				console.log('Generated balance: ' + JSON.stringify(data));			
			}, function error(response) {
				console.log(response.status);
			});
		}
	})

	.service('AuthenticationService', function($rootScope, $http, $resource, $cookies) {
		var vm = this;	
		vm.registerMessage;
		var authHeader;

		vm.authenticate = function(credentials, successCallback, errorCallback) {			
			authHeader = { Authorization: 'Basic ' + btoa(credentials.username + ':' + credentials.password) };
			var config = { headers: authHeader };
			$http
				// .post('api/login', {}, config)
				.post('http://127.0.0.1:8080/login', {}, config)
				.then(function success(value) {		
					$http.defaults.headers.common["Authorization"] = authHeader.Authorization;		
					$rootScope.currentUserName = credentials.username;
					$cookies.put('globals', authHeader.Authorization);
					$cookies.put('currentUserName', credentials.username);
					successCallback();				
				},
					function error(reason) {
						console.log('Login error');
						console.log(reason);
						errorCallback();
					});
		}
		vm.logout = function(successCallback) {		
			delete $http.defaults.headers.common["Authorization"];
			$cookies.remove('globals');
			$cookies.remove('currentUserName');
			(successCallback());	
		};
		vm.register = function(user, registerCallback) {
			console.log(user._proto_);
			user.$save(function() {
				vm.registerMessage = 'Rejestracja się powiodła! Możesz się zalogować.'
				registerCallback();
			},
				function error(response) {
					console.log(response.status);
					if (response.status == 409) {
						vm.registerMessage = response.data[0];
						console.log(response.data);
					}
					else {
						vm.registerMessage = 'Rejestracja nieudana!';
					}
					registerCallback();
				}
			)
		}
	})

	.service('InfoService', function() {

		var vm = this;	
	
	})