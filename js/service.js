'use strict';

angular.module('app')
	.service('ReceiptService', function(ReceiptsLatest, Receipt, ReceiptsWithoutTransfer,
		 $location, $rootScope, ReceiptsSearch) {
		var vm = this;
		vm.receipt = new Receipt();		
		vm.getLatestReceipts = function(limit) {
			return ReceiptsLatest.query({ resultSize: limit },
				function success(data) {
					console.log('Pobrano dane: ' + JSON.stringify(data));		
				},
				function error(response) {
					console.log(response.status);
				});
		}
		vm.getReceipt = function(id) {
			return Receipt.get({id: id}, 
				function success(data) {
					console.log('data downoladed: ' + JSON.stringify(data));
				},
				function error(response) {
					console.log(response.status);
				});
		}
		vm.addReceipt = function(receipt, successCallback, errorCallback) {
			vm.receipt = receipt;
			vm.errorInfo = "";			
			vm.receipt.$save(function(data) {
				vm.errorInfo = "";
				console.log('New receipt added: ' + JSON.stringify(data));
				successCallback(data.id);
				vm.receipt = new Receipt();
				
			},
			function error(reason) {
				console.log('adding receipt error: '+ JSON.stringify(reason));
					if(reason.data) vm.errorInfo = reason.data.toString();
					else vm.errorInfo = "adding receipt error";
					errorCallback(vm.errorInfo);
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
		vm.searchReceipts = function(key) {	
			return ReceiptsSearch.query({ key: key }, 
				function success(data) {
					console.log('Data downloaded: ' + JSON.stringify(data));
				},
				function error(reponse) {
					console.log(reponse.status);
				})
		}
		vm.deleteReceipt = function(id, successCallback, errorCallback) {
			vm.receipt.$delete({ id: id })
			.then(function success() {
				console.log('Receipt deleted');
				successCallback();
			},
				function error(reason) {
					console.log('deleting receipt error' + JSON.stringify(reason));
					errorCallback();
				});
		}
		vm.getReceiptDetails = function(id) {
			return Receipt.get({ id: id });
		}	
	})	
	.service('TransferService', function(TransfersLatest, Transfer, TransfersSearch) {
		var vm = this;
		vm.transfer = new Transfer();
		vm.getLatestTransfers = function(limit) {
			return TransfersLatest.query({ resultSize: limit },
				function success(data) {
					console.log('Data downloaded: ' + JSON.stringify(data));
				},
				function error(reponse) {
					console.log(reponse.status);
				});
		}
		vm.addTransfer = function(transfer, receiptId, successCallback, errorCallback) {
			vm.transfer = transfer;
			vm.errorInfo = "";
			vm.transfer.$save({receiptId: receiptId}, function(data) {
				vm.errorInfo = "";
				console.log('New transfer added: ' + JSON.stringify(data));
				successCallback(data.id);
				vm.transfer = new Transfer();
				},
				function error(reason) {
					console.log('adding transfer error: '+ JSON.stringify(reason));
					if(reason.data) vm.errorInfo = reason.data.toString();
					else vm.errorInfo = "adding transfer error";
					errorCallback(vm.errorInfo);
		})
		}
		vm.getTransferDetails = function(id) {
			return Transfer.get({ id: id });
		}
		vm.searchTransfers = function(key) {	
			return TransfersSearch.query({ key: key }, 
				function success(data) {
					console.log('Data downloaded: ' + JSON.stringify(data));
				},
				function error(reponse) {
					console.log(reponse.status);
				})
		}
		vm.deleteTransfer = function(id, successCallback, errorCallback) {
			vm.transfer.$delete({ id: id })
			.then(function success() {
				console.log('Transfer deleted');
				successCallback();
			},
				function error(reason) {
					console.log('deleting transfer error' + JSON.stringify(reason));
				});
		}

	})
	.service('BalanceService', function(Balance, CurrentMonthBalance, LastMonthBalance, BalanceForDateRange) {
		var vm = this;
		vm.getCurrentBalance = function() {
			return Balance.get({ }, function success(data) {
				console.log('Generated balance: ' + JSON.stringify(data));			
			}, function error(response) {
				console.log(response.status); 
			});
		}
		vm.getBalanceForCurrentMonth = function() {
			return CurrentMonthBalance.get({ }, function success(data) {
				console.log('Generated balance: ' + JSON.stringify(data));			
			}, function error(response) {
				console.log(response.status);
			});
		}
		vm.getBalanceForLastMonth = function() {
			return LastMonthBalance.get({ }, function success(data) {
				console.log('Generated balance: ' + JSON.stringify(data));			
			}, function error(response) {
				console.log(response.status);
			});
		}
		vm.getBalanceForDateRange = function(from, to) {
			return BalanceForDateRange.get({from: from, to: to}, function success(data) {
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
				.post(API_ADDRESS+'/login', {}, config)
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
				vm.registerMessage = 'Registration successful! You can log in..'
				registerCallback();
			},
				function error(response) {
					console.log(response.status);
					if (response.status == 409) {
						vm.registerMessage = response.data[0];
						console.log(response.data);
					}
					else {
						vm.registerMessage = 'Registration failed!';
					}
					registerCallback();
				}
			)
		}
	})

	.service('InfoService', function() {

		var vm = this;	
	
	})