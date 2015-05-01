'use strict';

angular.module('febworms').controller('febwormsEditPaletteCategoriesController', function ($scope, febwormsConfig) {

    $scope.categories = febwormsConfig.fields.categories;

    $scope.setCategory = function (name, category) {

        if (angular.isUndefined(name)) {
            $scope.categoryName = 'All categories';
            $scope.category = null;
        }
        else {
            $scope.categoryName = name;
            $scope.category = category;
        }
    };
    $scope.setCategory();
});