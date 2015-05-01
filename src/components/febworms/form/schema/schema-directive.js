'use strict';

angular.module('febworms').directive('febwormsSchema', function($parse) {
  return {
      require: ['febwormsSchema'],
      controller: 'febwormsSchemaController',
      link: function ($scope, $element, $attrs, ctrls) {
          var schemaCtrl = ctrls[0];

          var getModel = $parse($attrs.febwormsSchema);
          var setModel = getModel.assign;

          var model = getModel($scope);

          schemaCtrl.model(model);

          $scope.$watch(function () {
              return schemaCtrl.model();
          }, function (value) {
              setModel($scope, value);
          });
      }
  };
});

