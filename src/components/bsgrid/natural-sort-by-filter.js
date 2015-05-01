'use strict';

// Found reference for sort at http://stackoverflow.com/questions/17155856/angularjs-ng-repeat-orderby-orders-numbers-incorrectly
// used orderBy source for example at https://github.com/angular/angular.js/blob/master/src/ng/filter/orderBy.js#L3

angular.module('app').filter('naturalSortBy',function($parse){
    function naturalSort (a, b) {
        var re = /(^-?[0-9]+(\.?[0-9]*)[df]?e?[0-9]?$|^0x[0-9a-f]+$|[0-9]+)/gi,
            sre = /(^[ ]*|[ ]*$)/g,
            dre = /(^([\w ]+,?[\w ]+)?[\w ]+,?[\w ]+\d+:\d+(:\d+)?[\w ]?|^\d{1,4}[\/\-]\d{1,4}[\/\-]\d{1,4}|^\w+, \w+ \d+, \d{4})/,
            hre = /^0x[0-9a-f]+$/i,
            ore = /^0/,
            i = function(s) { return naturalSort.insensitive && (''+s).toLowerCase() || ''+s },
        // convert all to strings strip whitespace
            x = i(a).replace(sre, '') || '',
            y = i(b).replace(sre, '') || '',
        // chunk/tokenize
            xN = x.replace(re, '\0$1\0').replace(/\0$/,'').replace(/^\0/,'').split('\0'),
            yN = y.replace(re, '\0$1\0').replace(/\0$/,'').replace(/^\0/,'').split('\0'),
        // numeric, hex or date detection
            xD = parseInt(x.match(hre)) || (xN.length != 1 && x.match(dre) && Date.parse(x)),
            yD = parseInt(y.match(hre)) || xD && y.match(dre) && Date.parse(y) || null,
            oFxNcL, oFyNcL;
        // first try and sort Hex codes or Dates
        if (yD)
            if ( xD < yD ) return -1;
            else if ( xD > yD ) return 1;
        // natural sorting through split numeric strings and default strings
        for(var cLoc=0, numS=Math.max(xN.length, yN.length); cLoc < numS; cLoc++) {
            // find floats not starting with '0', string or 0 if not defined (Clint Priest)
            oFxNcL = !(xN[cLoc] || '').match(ore) && parseFloat(xN[cLoc]) || xN[cLoc] || 0;
            oFyNcL = !(yN[cLoc] || '').match(ore) && parseFloat(yN[cLoc]) || yN[cLoc] || 0;
            // handle numeric vs string comparison - number < string - (Kyle Adams)
            if (isNaN(oFxNcL) !== isNaN(oFyNcL)) { return (isNaN(oFxNcL)) ? 1 : -1; }
            // rely on string comparison if different types - i.e. '02' < 2 != '02' < '2'
            else if (typeof oFxNcL !== typeof oFyNcL) {
                oFxNcL += '';
                oFyNcL += '';
            }
            if (oFxNcL < oFyNcL) return -1;
            if (oFxNcL > oFyNcL) return 1;
        }
        return 0;
    }
    return function(array, sortPredicate, reverseOrder ) {
        if (!angular.isArray(array)) return array;
        if (!sortPredicate) return array;
        sortPredicate = angular.isArray(sortPredicate) ? sortPredicate: [sortPredicate];
        sortPredicate = _.map(sortPredicate, function(predicate){
            var descending = false,
                get = predicate || identity;
            if (angular.isString(predicate)) {
                if ((predicate.charAt(0) == '+' || predicate.charAt(0) == '-')) {
                    descending = predicate.charAt(0) == '-';
                    predicate = predicate.substring(1);
                }
                get = $parse(predicate);
                if (get.constant) {
                    var key = get();
                    return reverseComparator(function(a,b) {
                        return naturalSort(a[key], b[key]);
                    }, descending);
                }
            }
            return reverseComparator(function(a,b){
                return naturalSort(get(a),get(b));
            }, descending);
        });

        var arrayCopy = [];
        for ( var i = 0; i < array.length; i++) { arrayCopy.push(array[i]); }
        return arrayCopy.sort(reverseComparator(comparator, reverseOrder));

        function comparator(o1, o2){
            for ( var i = 0; i < sortPredicate.length; i++) {
                var comp = sortPredicate[i](o1, o2);
                if (comp !== 0) return comp;
            }
            return 0;
        }
        function reverseComparator(comp, descending) {
            return descending
                ? function(a,b){return comp(b,a);}
                : comp;
        }

    }
});