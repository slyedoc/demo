'use strict';

/*
      The field-value directive will re-render itself when certain validation values are modified.
      This is needed because angular does not watch or observe the values of certain attributes and allows
      an invalid initial value to be saved in the form schema.

      Important: the transcluded form field must be name fieldValue!

      <div febworms-property-field-value>
        <input type="text"
               name="fieldValue"
               ng-model="field.value"
               ng-minlength="{{ field.validation.minlength }}"
               ng-maxlength="{{ field.validation.maxlength }}"
               ng-pattern="/{{ field.validation.pattern }}/"/>
      </div>

      The febworms-field-redraw directive will trigger, on model change, the field-value to re-render itself.
 */

angular.module('febworms').directive('febwormsPropertyFieldValue', function(febwormsPropertyFieldValueLinkFn) {

  return {
    require: ['^form'],
    templateUrl: '../components/febworms/edit/canvas/field/properties/property-field/field-value.tmpl.html',
    transclude: true,
    link: febwormsPropertyFieldValueLinkFn
  };

}).factory('febwormsPropertyFieldValueLinkFn', function($parse) {

  return function($scope, $element, $attrs, ctrls) {

    $scope.draw = true;
    var frmCtrl = ctrls[0];
    var oldViewValue;

    $scope.$watch('field.$_redraw', function(value) {

      if (value) {

        var ngModelCtrl = frmCtrl['fieldValue'];

        if(ngModelCtrl) {
          oldViewValue = ngModelCtrl.$viewValue;
        }

        $scope.draw = false;
        $scope.field.$_redraw = false;
      } else {
        $scope.draw = true;
        $element = $element;
      }
    });

    $scope.$watch(function() { return frmCtrl['fieldValue']; }, function(ngModelCtrl) {
      if(ngModelCtrl && oldViewValue) {
        ngModelCtrl.$setViewValue(oldViewValue);
        ngModelCtrl.$render();
        oldViewValue = undefined;
      }
    });
  };
}).directive('febwormsFieldRedraw', function() {
  return {
    require: ['ngModel'],
    link: function($scope, $element, $attrs, ctrls) {

      var oldValue = $scope.$eval($attrs.ngModel);

      $scope.$watch($attrs.ngModel, function(value) {
        if(value != oldValue) {
          $scope.field.$_redraw = true;
          oldValue = value;
        }
      });
    }
  };
});
