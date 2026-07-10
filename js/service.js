"use strict";

angular
  .module("app")

  .service(
    "ReceiptService",
    function (
      ReceiptsLatest,
      Receipt,
      ReceiptsWithoutTransfer,
      ReceiptsSearch,
    ) {
      var service = this;

      service.getLatestReceipts = function (limit) {
        return ReceiptsLatest.query(
          { resultSize: limit },
          function (data) {
            console.log("Data downloaded: " + JSON.stringify(data));
          },
          function (response) {
            console.log(response.status);
          },
        );
      };

      service.getReceipt = function (id) {
        return Receipt.get(
          { id: id },
          function (data) {
            console.log("Data downloaded: " + JSON.stringify(data));
          },
          function (response) {
            console.log(response.status);
          },
        );
      };

      service.addReceipt = function (receipt, successCallback, errorCallback) {
        receipt.$save(
          function (data) {
            console.log("New receipt added: " + JSON.stringify(data));
            successCallback(data.id);
          },
          function (reason) {
            console.log("Adding receipt error: " + JSON.stringify(reason));

            var errorInfo = reason.data
              ? reason.data.toString()
              : "Adding receipt error";

            errorCallback(errorInfo);
          },
        );
      };

      service.getReceiptsWithoutTransfer = function () {
        return ReceiptsWithoutTransfer.query(
          {},
          function (data) {
            console.log("Data downloaded: " + JSON.stringify(data));
          },
          function (response) {
            console.log(response.status);
          },
        );
      };

      service.searchReceipts = function (key) {
        return ReceiptsSearch.query(
          { key: key },
          function (data) {
            console.log("Data downloaded: " + JSON.stringify(data));
          },
          function (response) {
            console.log(response.status);
          },
        );
      };

      service.deleteReceipt = function (id, successCallback, errorCallback) {
        Receipt.delete(
          { id: id },
          function () {
            console.log("Receipt deleted");
            successCallback();
          },
          function (reason) {
            console.log("Deleting receipt error: " + JSON.stringify(reason));
            errorCallback();
          },
        );
      };

      service.getReceiptDetails = function (id) {
        return Receipt.get({ id: id });
      };
    },
  )

  .service(
    "TransferService",
    function (TransfersLatest, Transfer, TransfersSearch) {
      var service = this;

      service.getLatestTransfers = function (limit) {
        return TransfersLatest.query(
          { resultSize: limit },
          function (data) {
            console.log("Data downloaded: " + JSON.stringify(data));
          },
          function (response) {
            console.log(response.status);
          },
        );
      };

      service.addTransfer = function (
        transfer,
        receiptId,
        successCallback,
        errorCallback,
      ) {
        transfer.$save(
          { receiptId: receiptId },
          function (data) {
            console.log("New transfer added: " + JSON.stringify(data));
            successCallback(data.id);
          },
          function (reason) {
            console.log("Adding transfer error: " + JSON.stringify(reason));

            var errorInfo = reason.data
              ? reason.data.toString()
              : "Adding transfer error";

            errorCallback(errorInfo);
          },
        );
      };

      service.getTransferDetails = function (id) {
        return Transfer.get({ id: id });
      };

      service.searchTransfers = function (key) {
        return TransfersSearch.query(
          { key: key },
          function (data) {
            console.log("Data downloaded: " + JSON.stringify(data));
          },
          function (response) {
            console.log(response.status);
          },
        );
      };

      service.deleteTransfer = function (id, successCallback, errorCallback) {
        Transfer.delete(
          { id: id },
          function () {
            console.log("Transfer deleted");
            successCallback();
          },
          function (reason) {
            console.log("Deleting transfer error: " + JSON.stringify(reason));
            errorCallback();
          },
        );
      };
    },
  )

  .service(
    "BalanceService",
    function (
      Balance,
      CurrentMonthBalance,
      LastMonthBalance,
      BalanceForDateRange,
    ) {
      var service = this;

      service.getCurrentBalance = function () {
        return Balance.get(
          {},
          function (data) {
            console.log("Generated balance: " + JSON.stringify(data));
          },
          function (response) {
            console.log(response.status);
          },
        );
      };

      service.getBalanceForCurrentMonth = function () {
        return CurrentMonthBalance.get(
          {},
          function (data) {
            console.log("Generated balance: " + JSON.stringify(data));
          },
          function (response) {
            console.log(response.status);
          },
        );
      };

      service.getBalanceForLastMonth = function () {
        return LastMonthBalance.get(
          {},
          function (data) {
            console.log("Generated balance: " + JSON.stringify(data));
          },
          function (response) {
            console.log(response.status);
          },
        );
      };

      service.getBalanceForDateRange = function (from, to) {
        return BalanceForDateRange.get(
          { from: from, to: to },
          function (data) {
            console.log("Generated balance: " + JSON.stringify(data));
          },
          function (response) {
            console.log(response.status);
          },
        );
      };
    },
  )

  .service(
    "AuthenticationService",
    function ($rootScope, $http, $cookies, API_ADDRESS) {
      var service = this;

      service.registerMessage = "";

      service.authenticate = function (
        credentials,
        successCallback,
        errorCallback,
      ) {
        var authHeader = {
          Authorization:
            "Basic " + btoa(credentials.username + ":" + credentials.password),
        };

        var config = {
          headers: authHeader,
        };

        $http.post(API_ADDRESS + "/login", {}, config).then(
          function () {
            $http.defaults.headers.common["Authorization"] =
              authHeader.Authorization;

            $rootScope.currentUserName = credentials.username;

            $cookies.put("globals", authHeader.Authorization);
            $cookies.put("currentUserName", credentials.username);

            successCallback();
          },
          function (reason) {
            console.log("Login error", reason);
            errorCallback();
          },
        );
      };

      service.logout = function (successCallback) {
        delete $http.defaults.headers.common["Authorization"];

        $cookies.remove("globals");
        $cookies.remove("currentUserName");

        successCallback();
      };

      service.register = function (user, registerCallback) {
        user.$save(
          function () {
            service.registerMessage =
              "Registration successful! You can log in.";

            registerCallback();
          },
          function (response) {
            console.log(response.status);

            if (response.status === 409) {
              service.registerMessage = response.data[0];
            } else {
              service.registerMessage = "Registration failed!";
            }

            registerCallback();
          },
        );
      };
    },
  )

  .service("InfoService", function () {
    var vm = this;
  });
