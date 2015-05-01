'use strict';

angular.module('app')
  .controller('BsgridCtrl', function ($scope) {

      $scope.items = [
        {name: 'Test', state: 'Ready'},
        {name: 'Test 2', state: 'In Process'},
        {name: 'Test 3', state: 'In Process'},
        {name: 'Test 4', state: 'In Process'},
        {name: 'Test 5', state: 'In Process'},
        {name: 'Test 6', state: 'In Process'},
        {name: 'Test 7', state: 'In Process'},
        {name: 'Test 8', state: 'Ready'},
        {name: 'Test 9', state: 'Ready'},
        {name: 'Test 10', state: 'Ready'},
        {name: 'Test 11', state: 'Ready'},
        {name: 'Test 12', state: 'Ready'},
        {name: 'Test 13', state: 'Ready'},
        {name: 'Test 14', state: 'In Process'}
      ];

      $scope.selectedItems = [];

      $scope.options = {
        items: $scope.items,
        columns: [
          {name: 'Name', field: 'name', sorted: true },
          {name: 'State', field: 'state'  }
        ],
        selectable: true,
        multiSelect: true,
        selectedItems: $scope.selectedItems,
        localStorage: true,
        lockTable: false,
        showExportButton: true
      };
  });
