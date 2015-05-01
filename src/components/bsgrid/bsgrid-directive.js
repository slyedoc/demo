'use strict';

/**
 * @ngDoc directive
 * @name bsGrid
 * @param {expression} bsGrid
 */
angular.module('app').directive('bsGrid', function () {
    return {
        scope: {
            options: '='
        },
        templateUrl: '../components/bsgrid/bsgrid.html',
        restrict: 'E',
        controller: function ($scope, $element, $filter, $timeout, $state, localStorageService, $compile, $translate, $q) {

            $scope.filteredItems = $scope.options.items;
            $scope.displayedItems = [];

            $scope.showing = {
                begin: 0,
                end: 0,
                of: 0
            };

            //set values if not defined
            $scope.setUndefined = function () {
                if (angular.isUndefined($scope.options.pageSizeShow)) {
                    $scope.options.pageSizeShow = true;
                }
                if (angular.isUndefined($scope.options.pageSize)) {
                    $scope.options.pageSize = 25;
                }
                if (angular.isUndefined($scope.options.pageSizeOptions)) {
                    $scope.options.pageSizeOptions = [10, 25, 50, 100];
                }
                if (angular.isUndefined($scope.options.localStorage)) {
                    $scope.options.localStorage = false;
                }
                if (angular.isUndefined($scope.options.localStorageIgnorePageSize)) {
                    $scope.options.localStorageIgnorePageSize = false;
                }
                if (angular.isUndefined($scope.options.lockTable)) {
                    $scope.options.lockTable = true;
                }
                if (angular.isUndefined($scope.options.selectable)) {
                    $scope.options.selectable = false;
                }
                if (angular.isUndefined($scope.options.multiSelect)) {
                    $scope.options.multiSelect = false;
                }
                if (angular.isUndefined($scope.options.scope)) {
                    $scope.options.scope = $scope;
                }
                $scope.scope = $scope.options.scope;

                if (angular.isUndefined($scope.options.showSearch)) {
                    $scope.options.showSearch = true;
                }
                if (angular.isUndefined($scope.options.showFooter)) {
                    $scope.options.showFooter = true;
                }
                if (angular.isUndefined($scope.options.showExportButton)) {
                    $scope.options.showExportButton = true;
                }
                if (angular.isUndefined($scope.options.name)) {
                    $scope.options.name = $state.current.name;
                }
                if (angular.isUndefined($scope.options.scrollHorizontal)) {
                    $scope.options.scrollHorizontal = true;
                }
                _.forEach($scope.options.columns, function (c) {
                    if (angular.isUndefined(c.width)) {
                        c.width = 'auto';
                    }
                    if (angular.isUndefined(c.sortable)) {
                        c.sortable = true;
                    }
                    if (angular.isUndefined(c.name) && angular.isUndefined(c.field)) {
                        throw 'bsgrid: Name is required if no field is provided.';
                    }
                    if (angular.isUndefined(c.visible)) {
                        c.visible = true;
                    }
                    if (angular.isUndefined(c.translate)) {
                        c.translate = false;
                    }
                });
            };

            $scope.localStorageName = function () {
                return 'bsGrid-' + $scope.options.name;
            };

            //Check local storage for saved settings
            $scope.getLocalStorage = function () {
                if (!$scope.options.localStorage) {
                    return;
                }

                var data = localStorageService.get($scope.localStorageName());
                if (data) {
                    if (angular.isDefined(data.pageSize) && !$scope.options.localStorageIgnorePageSize) {
                        $scope.options.pageSize = data.pageSize;
                    }
                    if (angular.isDefined(data.columns)) {
                        // don't take all info, we just want the visable columns, order, reverse, and which is sorted from localStorage
                        var isSorted = false;
                        _.forEach( data.columns, function (c, i) {
                            var index = _.findIndex($scope.options.columns, {name: c.name});
                            if( index >= 0)
                            {
                                if( i !== index)
                                {
                                    $scope.options.columns.swap( index, i);
                                }
                                $scope.options.columns[i].visible = c.visible;
                                $scope.options.columns[i].sorted = c.sorted;
                                if( !angular.isUndefined(c.reverse) ) {
                                    $scope.options.columns[i].reverse = c.reverse;
                                }
                                if(c.sorted) {
                                    isSorted = true;
                                }
                            }

                        });

                        //if nothing is sorted, sort the first column
                        if( !isSorted ) {
                            $scope.options.columns[0].sorted = true;
                        }
                    }
                }
            };

            $scope.hideColumn = function (c) {
                c.visible = !c.visible;
                $scope.setLocalStorage();
            };

            //saves settings to local storage
            $scope.setLocalStorage = function () {
                if (!$scope.options.localStorage) {
                    return;
                }

                localStorageService.set($scope.localStorageName(), {
                    pageSize: $scope.options.pageSize,
                    columns: $scope.options.columns
                });
            };

            $scope.onDropComplete = function (index, obj, evt) {
                //obj is the column that was moved, index is the column index that obj was dropped onto.
                var otherIndex = $scope.options.columns.indexOf(obj);
                $scope.options.columns.splice(otherIndex, 1);
                $scope.options.columns.splice(index, 0, obj);
                $scope.setLocalStorage();
            };

            $scope.setWatches = function () {
                //watch pageSize
                $scope.$watch(function () {
                    return $scope.options.pageSize;
                }, function () {
                    $scope.setLocalStorage();
                    $scope.options.currentPage = 1;
                    $scope.getPage();
                }, true);

                //watch items
                $scope.$watch(function () {
                    return $scope.options.items;
                }, function () {
                    //check that no items in selected have been removed
                    var newSelected = [];
                    _.forEach($scope.options.selectedItems, function (item) {
                        var index = _($scope.options.items).indexOf(item);
                        //if the current selected item is NOT in the master items list, save it.
                        if (index === -1) {
                            //save the item so it can be removed from the selectedItems list
                            newSelected.push(item);
                        }
                    });
                    //Remove each saved item from the selected Items list unless there is an item with the same id
                    _.forEach(newSelected, function (item) {

                        var matches = null;
                        var match = null;

                        // check if there is an item with the same id, if there is add it to selected items,
                        // assuming it was just updated and we still want it selected

                        if (!angular.isUndefined(item.id)) {
                            matches = _.where($scope.options.items, {'id': item.id});
                            if (matches.length === 1) {
                                match = matches[0];
                            }
                        }
                        var sIndex = _.indexOf($scope.options.selectedItems, item);
                        if (match) {
                            $scope.options.selectedItems.splice(sIndex, 1, match);
                        }
                        else {
                            $scope.options.selectedItems.splice(sIndex);
                        }
                    });

                    $scope.start();
                }, true);
            };

            //Updates the current displayed items and showing info
            $scope.getPage = function () {
                var begin = (($scope.options.currentPage - 1) * $scope.options.pageSize);
                var end = begin + $scope.options.pageSize;
                $scope.displayedItems = $scope.filteredItems.slice(begin, end);

                //update showing info
                if ($scope.displayedItems.length === 0) {
                    $scope.showing.begin = begin;
                }
                else {
                    $scope.showing.begin = begin + 1;
                }

                $scope.showing.end = begin + $scope.displayedItems.length;
                $scope.showing.of = $scope.filteredItems.length;
            };

            //sort all the items by a column
            $scope.sort = function (col, changeReverse) {
                //exit if we cant sort this column
                if (col.sortable !== true) {
                    return;
                }

                //unsort the rest
                _.forEach($scope.options.columns, function (c) {
                    if (c !== col) {
                        c.sorted = false;
                        c.reverse = false;
                    }
                });

                //if it was already sorted and reverse was not set, reverse it
                col.sorted = true;
                if (changeReverse) {
                    col.reverse = !col.reverse;
                }

                var filter = $filter('orderBy');
                $scope.filteredItems = filter($scope.filteredItems, col.field, col.reverse);
                $scope.getPage();

                $scope.setLocalStorage();
            };

            //filter the items based on the search filter
            $scope.filter = function () {
                var filter = $filter('filter');
                $scope.filteredItems = filter($scope.options.items, $scope.options.searchFilter);
                $scope.getPage();
            };

            $scope.selectItem = function (item) {

                if (!$scope.options.selectable) {
                    return;
                }

                var index = _.indexOf($scope.options.selectedItems, item);
                if (index !== -1) {
                    $scope.options.selectedItems.splice(index, 1);
                    return;
                }
                if (!$scope.options.multiSelect && $scope.options.selectedItems.length === 1) {
                    $scope.options.selectedItems.splice(0, 1);
                }
                $scope.options.selectedItems.push(item);
            };

            //stops the click from going to the row and switching it a second time
            $scope.selectItemCheckbox = function ($event, item) {
                $event.stopPropagation();
                $scope.selectItem(item);
            };

            $scope.isSelectedItem = function (item) {

                var index = _.indexOf($scope.options.selectedItems, item);
                if (index !== -1) {
                    return true;
                }
                return false;
            };

            $scope.toggleSelectAll = function (value) {
                if (value) {
                    _.forEach($scope.filteredItems, function (item) {
                        if (!$scope.isSelectedItem(item)) {
                            $scope.selectItem(item);
                        }
                    });
                }
                else {
                    _.forEach($scope.filteredItems, function (item) {
                        if ($scope.isSelectedItem(item)) {
                            $scope.selectItem(item);
                        }
                    });
                }
            };

            //locks the table, got the idea from https://github.com/turn/angular-lock-column-widths
            //fixs a problem where auto size changes from page to page
            $scope.lockTable = function () {
                if (!$scope.options.lockTable) {
                    return;
                }

                //wait for dom to render so we can find the ths
                $timeout(function () {
                    var ths = angular.element($element).find('div table thead tr th');

                    // going to assume each element is in the same order as columes, if they are set to auto, we are
                    // going to hard code there width
                    var i = 0;

                    _.forEach(ths, function (th) {
                        var e = angular.element(th);

                        if ($scope.options.selectable && i === 0) { //skip the first th, and reset i;
                            i--;
                        }
                        else if ($scope.options.columns[i].width === 'auto') {
                            angular.element(e).css('width', th.offsetWidth);
                        }
                        i++;
                    });

                    //now lock the table so it doesn't change
                    var table = angular.element($element).find('div table');
                    angular.element(table).css('table-layout', 'fixed');
                }, 0);
            };

            //everything is setup, filler and sort
            $scope.start = function () {

                if ($scope.options.searchFilter !== '') {
                    $scope.filter();
                }

                var col = _.find($scope.options.columns, 'sorted');
                if (!angular.isUndefined(col)) {
                    $scope.sort(col, false);
                }
                else
                {
                    $scope.getPage();
                }
            };

            $scope.init = function () {
                $scope.setUndefined();
                $scope.getLocalStorage();
                $scope.setWatches();
                $scope.lockTable();

                $scope.start();
            };
            $scope.init();

            // ******* Export: *******

            $scope.exportTypes = {
                FILTERED:   0,
                SELECTED:   1,
                ALL:        2
            };


            $scope.GetRowsForExport = function (exportType, fieldNames, csvData) {

                var itemIndex = 0;
                var curCellRaw = '';
                var itemsToExport = [];

                // What items we are importing?
                switch (exportType) {
                    case $scope.exportTypes.FILTERED:
                        itemsToExport = $scope.displayedItems;
                        break;
                    case $scope.exportTypes.SELECTED:
                        itemsToExport = $scope.options.selectedItems;
                        break;
                    case $scope.exportTypes.ALL:
                        itemsToExport = $scope.options.items;
                        break;
                }

                // Go through every item
                _.each(itemsToExport, function (itemToExport) {

                    // Go through fields
                    _.each(fieldNames, function (fieldName) {

                        // Is field name defined?
                        if ( !angular.isUndefined(itemToExport[fieldName]) ) {
                            curCellRaw = itemToExport[fieldName];
                        }
                        else if ( !angular.isUndefined(itemToExport.search) &&
                            !angular.isUndefined(itemToExport.search[fieldName])) {
                            // Yes, so get the cell value
                            curCellRaw = itemToExport.search[fieldName];
                        }
                        else
                        {
                            // TODO: Shouldn't reach this, this happens when a model directive isn't loaded due to paging
                            curCellRaw = '';
                        }

                        csvData += '"' + $scope.csvStringify(curCellRaw) + '",';   // Creates a new row in CSV
                    });

                    csvData = $scope.swapLastCommaForNewline(csvData);
                    itemIndex++;
                });

                return csvData;
            };

            // Clean up the string.
            $scope.csvStringify = function (str) {
                if (str === null || angular.isUndefined(str) ) {
                    return '';
                }
                if (typeof(str) === 'number') {
                    return '' + str;
                }
                if (typeof(str) === 'boolean') {
                    return (str ? 'True' : 'False');
                }
                if (typeof(str) === 'string') {
                    return str.replace(/"/g, '""');
                }

                return JSON.stringify(str).replace(/"/g, '""');
            };


            // Delete last comma from CSV string.
            $scope.swapLastCommaForNewline = function (str) {
                var newStr = str.substr(0, str.length - 1);
                return newStr + '\n';
            };


            // Create a downloadable link and click it.
            $scope.SubmitFileToUser = function (csvData) {
                var element = angular.element('<a/>');
                element.attr({
                    href: 'data:attachment/csv;charset=utf-8,' + encodeURI(csvData),
                    target: '_blank',
                    download: 'export.csv'
                })[0].click();
            };


            $scope.Export = function (exportType) {

                var fieldNames = [];
                var csvData = '';
                var requests = [];


                // Get column names for displaying in a report and names of all fields
                _.each($scope.options.columns, function (c) {
                    fieldNames.push(c.field);
                    requests.push(c.name);

                });

                // Create a header for CSV Export
                _.each(requests, function (v) {
                    csvData += '"' + $scope.csvStringify(v) + '",';
                });


                csvData = $scope.swapLastCommaForNewline(csvData);
                csvData = $scope.GetRowsForExport(exportType, fieldNames, csvData);

                // Send it to user
                $scope.SubmitFileToUser(csvData);

            };
        },
        link: function (scope, element, attrs) {

        }
    };
});
//********** Exports ends here **********


// souce from http://stackoverflow.com/questions/14846836/insert-an-angular-js-template-string-inside-an-element
angular.module('app').directive('bsGridCellTemplate', function ($compile) {
    return {
        scope: true,
        link: function (scope, element, attrs) {
            var el;

            attrs.$observe('bsGridCellTemplate', function (tpl) {
                if (angular.isDefined(tpl)) {
                    // compile the provided template against the current scope
                    el = $compile(tpl)(scope);

                    // stupid way of emptying the element
                    element.html('');

                    // add the template content
                    element.append(el);
                }
            });
        }
    };
});

