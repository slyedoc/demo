'use strict';

angular.module('febworms').controller('febwormsEditController', function ($scope, febwormsUtils) {

    var self = this;

    this.setMetaForm = function (metaForm) {
        self.metaForm = metaForm;
    };

    $scope.$watch(function () {

        var schema = $scope.schemaCtrl.model();

        // Seems that this watch is sometimes fired after the scope has been destroyed(?)
        if (schema) {
            schema.$_invalid = self.metaForm ? self.metaForm.$invalid : false;
            if (!schema.$_invalid) {
                var fields = schema.fields;
                if (fields) {

                    var i = fields.length;

                    while (--i >= 0 && !schema.$_invalid) {
                        schema.$_invalid = fields[i].$_invalid;
                    }

                }
            }
        }
    });

});