'use strict';

angular.module('app')
    .controller('MortgageCtrl', function ($scope) {
        var vm = this;

        vm.data = {
            ammount: 200000,
            interest: 6.5,
            years: 30
        };

        vm.total = 0;


        vm.formFields = [
            {
                key: 'ammount',
                type: 'input',
                templateOptions: {
                    label: 'Ammount',
                    type: "number",
                    placeholder: 'Mortgage Ammount',
                    required: true
                },
                watcher: {
                    listener: function(field, newValue, oldValue, scope, stopWatching) {
                        vm.updateTotal();
                    }
                }
            },
            {
                key: 'interest',
                type: 'input',
                templateOptions: {
                    label: 'Interest',
                    placeholder: 'Interest',
                    type: "number",
                    required: true
                },
                watcher: {
                    listener: function(field, newValue, oldValue, scope, stopWatching) {
                        vm.updateTotal();
                    }
                }
            },
            {
                key: "years",
                type: "select",
                templateOptions: {
                    label: "Years",
                    valueProp: "name",
                    default: 2,
                    options: [
                        {
                            "name": 1
                        },
                        {
                            "name": 3
                        },
                        {
                            "name": 5
                        },
                        {
                            "name": 15
                        },
                        {
                            "name": 30
                        }
                    ],
                    required: true
                },
                watcher: {
                    listener: function(field, newValue, oldValue, scope, stopWatching) {
                        vm.updateTotal();
                    }
                }
            }
        ];

        vm.updateTotal = function () {

            //mortgage function via http://en.wikipedia.org/wiki/Mortgage_calculator
            vm.total = ((vm.data.interest / 100 / 12) * vm.data.ammount) / (1 - Math.pow((1 + (vm.data.interest / 100 / 12)), -vm.data.years * 12) )

        };
        vm.updateTotal();

    });