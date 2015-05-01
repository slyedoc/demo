'use strict';

angular.module('febworms').directive('febwormsEdit', function () {
    return {
        priority: 100,
        require: 'febwormsSchema',
        restrict: 'AE',
        scope: {
            // // The schema model to edit
            schema: '=?febwormsSchema',
            //value of the model
            model: '=?febwormsModel',
            // Boolean indicating if the actions buttons should be shown
            actionsEnabled: '=?febwormsActionsEnabled',
            // Boolean indicating if the forms should be in preview mode only
            preview: '=?febwormsPreview',
            // Boolean indicating if the form controls should be disabled for viewing form data
            febwormsDisabled: '=?febwormsDisabled'
        },
        replace: true,
        controller: 'febwormsEditController as editCtrl',
        templateUrl: '../components/febworms/edit/edit.html',
        link: function ($scope, $element, $attrs, schemaCtrl) {

            if ($scope.schema === undefined) {
                $scope.schema = {};
            }

            if ($scope.model === undefined) {
                $scope.model = {
                    data: {}
                };
            }

            if ($scope.actionsEnabled === undefined) {
                $scope.actionsEnabled = true;
            }

            if ($scope.preview === undefined) {
                $scope.preview = false;
            }

            if ($scope.febwormsDisabled === undefined) {
                $scope.febwormsDisabled = false;
            }

            $scope.$watch(function () {
                return $scope.schema;
            }, function () {
                schemaCtrl.model($scope.schema);
            }, true);

            schemaCtrl.model($scope.schema);
            $scope.schemaCtrl = schemaCtrl;
        }
    };
});
