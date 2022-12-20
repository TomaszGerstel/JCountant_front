'use strict';

angular.module('app')
	.controller('MainController', function($rootScope) {
		
		var vm = this;	
		$rootScope.menuSelectedItem;
		vm.menuClick = function (id) {		
			if($rootScope.menuSelectedItem) $rootScope.menuSelectedItem.classList.remove('selected');
			$rootScope.menuSelectedItem = document.getElementById(id);
			$rootScope.menuSelectedItem.classList.add('selected');			
		}
	})
	
	.controller('ReceiptController', function(ReceiptService, Receipt) {
		var vm = this;
		vm.receipt = new Receipt();	
		vm.latestReceipts = ReceiptService.getLatestReceipts();
		vm.addReceipt = function() {
			// if (cause.description == null) return;
			ReceiptService.addReceipt(vm.receipt,
				vm.success = function() {					
					vm.receipt = new Receipt();
				});
		}	
		
	})
	.controller('TransferController', function(TransferService, Transfer, ReceiptService) {
		var vm = this;
		vm.transfer = new Transfer();
		vm.receiptId = null;
		vm.latestTransfers = TransferService.getLatestTransfers();
		vm.receiptsWithoutTransfer = ReceiptService.getReceiptsWithoutTransfer();
		vm.addTransfer = function() {
			TransferService.addTransfer(vm.transfer, vm.receiptId,
				vm.success = function() {
					vm.transfer = new Transfer();
				});
			} 
	})
	.controller('BalanceController', function(BalanceService) {
		var vm = this;		
		vm.balance = BalanceService.getCurrentBalance();
	
			
	})


	.controller('RegisterController', function(AuthenticationService, User) {
		var vm = this;
		vm.user = new User();
		vm.registerMessage;
		vm.register = function() {
			AuthenticationService.register(vm.user, registerCallback);
			vm.user = new User();
		}
		var registerCallback = function() {
			vm.registerMessage = AuthenticationService.registerMessage;
		}
	})
	.controller('LoginController', function($rootScope, $location, AuthenticationService) {
		var vm = this;
		vm.credentials = {};
		vm.showErrMessage = false;

		var loginSuccess = function() {
			$rootScope.authenticated = true;
			console.log('auth: ' + $rootScope.authority);
			console.log('usernaname: ' + $rootScope.username);
			$location.path('/');
		}
		var logoutSuccess = function() {
			$rootScope.authenticated = false;
			$location.path('/');
		}
		vm.login = function() {
			AuthenticationService.authenticate(vm.credentials, loginSuccess, vm.showErrMess);
		}
		vm.showErrMess = function() {
			vm.showErrMessage = true;
		}
		vm.logout = function() {		
			AuthenticationService.logout(logoutSuccess);
		}
	})
	

	.controller('InfoController', function() {

		var vm = this;	

	
	})