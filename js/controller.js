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
		vm.balanceInfo = "Current balance (for all time)";
		vm.fromDate;
		vm.toDate;
		vm.balance = BalanceService.getCurrentBalance();
		vm.currentBalance = vm.balance;
		vm.showBalanceForCurrentMonth = function() {
			vm.balance = BalanceService.getBalanceForCurrentMonth();
			vm.balanceInfo = "Balance for current month";
		}
		vm.showBalanceForLastMonth = function() {
			vm.balance = BalanceService.getBalanceForLastMonth();
			vm.balanceInfo = "Balance for last month";
		}
		vm.showBalanceForDateRange = function() {
			vm.fromDateForm = vm.formatDate(vm.fromDate);
			vm.toDateForm = vm.formatDate(vm.toDate);
			vm.balance = BalanceService.getBalanceForDateRange(vm.fromDateForm, vm.toDateForm);
			vm.balanceInfo = "Balance for date range from: "+vm.fromDateForm+" to: "+vm.toDateForm;
		}
		vm.formatDate = function (date) {
			vm.month = (date.getMonth() + 1).toString();
			vm.day = date.getDate().toString();
			vm.year = date.getFullYear().toString();
		
			if (vm.month.length < 2) 
				vm.month = '0' + vm.month;
			if (vm.day.length < 2) 
				vm.day = '0' + vm.day;
		
			return [vm.year, vm.month, vm.day].join('-');
		}
	
			
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