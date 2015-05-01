'use strict';

angular.module('febworms').directive('febwormsEditFormActionsDesigner', function(febwormsConfig) {

  return {
    require: '^febwormsEdit',
    templateUrl: '../components/febworms/edit/form-actions/form-actions-designer.html',
    link: function($scope, $element, $attrs, febwormsEditController) {

      $scope.debugInfoEnabled = febwormsConfig.enableDebugInfo;

      $scope.handleSave = function() {
        if(!$scope.schema.$_invalid) {
          $scope.onSave({ schema: $scope.schema });
        }
      };

      $scope.handleCancel = function() {
        $scope.onCancel({ schema: $scope.schema });
      };

    }
  };
});
