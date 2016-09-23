'use strict';

/* App Module */

var spaninsApp = angular.module('spaninsApp', [
    'ngRoute',
    'restangular',
    'ngMaterial',
    'md.data.table',
    'ngMdIcons',
    'ngAnimate'
]);

var sds = [
            'AGGAGGT',
            'AGGAGG',
            'GGAGGT',
            'AGGAG',
            'GGAGG',
            'GAGGT',
            'AGGA',
            'GGAG',
            'GAGG',
            'AGGT',
            'AGG',
            'GGA',
            'GAG',
            'GGT'
        ]

spaninsApp.config(['$routeProvider', 'RestangularProvider',
    function($routeProvider, RestangularProvider) {
        $routeProvider.
            when('/phages', {
                templateUrl: 'partials/phage_list.html',
                controller: 'PhageListCtrl'
            }).
            when('/phages/:phageID', {
                templateUrl: 'partials/phage_detail.html',
                controller: 'PhageDetailCtrl'
            }).
            when('/spaninfreq', {
                templateUrl: 'partials/spanin_freq.html',
                controller: 'SpaninFreqCtrl'
            }).
            otherwise({
                redirectTo: '/phages'
            });
        RestangularProvider.setBaseUrl('http://localhost:8000/');
        RestangularProvider.setRequestSuffix('/');
        RestangularProvider.addResponseInterceptor(function(data, operation, what, url, response, deferred) {
            var extractedData;
            // .. to look for getList operations
            if (operation === "getList") {
            // .. and handle the data and meta data
                extractedData = data.results;
                extractedData.meta = {
                    'count': data.count,
                    'next': data.next,
                    'previous': data.previous
                }
            } else {
                extractedData = data;
            }
            return extractedData;
        });
}]);

spaninsApp.filter('spanin_type_filter', function() {
    return function(input) {
        switch(input){
            case 0:
                return "embedded";
            case 1:
                return "overlapping";
            case 2:
                return "separate";
            case 3:
                return "unimolecular";
        }
    };
});

spaninsApp.filter('color_filter', function() {
    return function(input) {
        switch(true) {
            case (input < 5):
                return "#ffff99";
            case (input >= 5 && input < 10):
                return "#ffff00";
            case (input >= 10 && input < 15):
                return "#ff9900";
            case (input >= 15 && input < 20):
                return "#e65c00";
            case (input >= 20 && input < 30):
                return "#ff0000";
            case (input >= 30):
                return '#990000'
        }
    };
});

spaninsApp.controller('PhageListCtrl', ['$scope', 'Restangular', '$location',
    function($scope, Restangular, $location) {
        $scope.go = function(id) {
            $location.path('/phages/' + id);
        };

        $scope.spanin_types = [0, 1, 2, 3];
        $scope.choice = '';
        $scope.updateData = function(page) {
            if(!isNaN(parseInt(page))){
                $scope.query.page = page;
            }
            $scope.query.ordering = $scope.ordering;
            $scope.query.search = $scope.search;
            $scope.query.spanin_type = $scope.choice;
            $scope.promise = Restangular.all('phages').getList($scope.query).then(function(data) {
                $scope.phages = data;
            });
        };

        $scope.idk = function() {
            console.log('idk');
        };

        $scope.options = {
            limitSelect: true,
            pageSelect: true
        };

        $scope.query = {
            limit: 10,
            page: 1,
            search: $scope.search,
            spanin_type: $scope.choice,
        };

        $scope.updateData(1);
}]);

spaninsApp.controller('PhageDetailCtrl', ['$scope', 'Restangular', '$routeParams',
    function($scope, Restangular, $routeParams) {
        Restangular.one('phages', $routeParams.phageID).get().then(function(data) {
            $scope.phage = data;
        });
}]);

spaninsApp.controller('SpaninFreqCtrl', ['$scope', 'Restangular', '$filter',
    function($scope, Restangular, $filter) {
        $scope.sds = sds
        $scope.heatmap = function(i) {
            return $filter('color_filter')(i);
        };

        Restangular.oneUrl('spaninfreq', 'http://localhost:8000/spaninfreq/').get().then(function(data) {
            $scope.idk = data.plain();
        });
}]);
