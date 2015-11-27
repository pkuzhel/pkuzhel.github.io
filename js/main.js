/*--------------------------------------------------------------------
[Main javascript files]

Project:    Angular Based Personal Website Module
License:    http://themeforest.net/licenses
Date:   09/2015
Author:     Tuxsanov
Description:    All the codes written with seperated directives and modules. You can add any modules freely such as (Bootstrap, jQuery and so on)

--------------------------------------------------------------------*/


(function() {

    "use strict";

    /*********
     *** Configuration the app ***
     *********/
    var app = angular.module('personalWebsiteApp', ['ngAnimate', 'ngSanitize']); // ngAnimate dependened for the animation purposes, ngSanitize for sanitizing urls and elements
    app.config(['$locationProvider', function($locationProvider) {
        $locationProvider.html5Mode(true); // for removing hash from the url
    }]);

    /*********
     *** main-container directive ***
     *********/
    app.directive('mainContainer', function() {
        return {
            restrict: 'EC',
            transclude: true,
            template: '<div ng-include="views"></div>'
        }
    });

    /*********
     *** full-width-container directive ***
     *********/
    app.directive('fullWidthContainer', function() {
        return {
            restrict: 'C',
            transclude: true,
            template: '<div class="single-info-container slide-top" ng-if="itemone" ng-transclude></div>'
        }
    });

    /*********
     *** left-side-container directive ***
     *********/
    app.directive('leftSideContainer', function() {
        return {
            restrict: 'C',
            transclude: true,
            template: '<div class="col-md-8 slide-top" ng-if="itemone" ng-transclude></div>'
                // template: '<div class="info-container slide-top" ng-if="itemone" ng-transclude></div>'
        }
    });

    /*********
     *** right-side-container directive ***
     *********/
    app.directive('rightSideContainer', function() {
        return {
            restrict: 'C',
            transclude: true,
            template: '<div class="col-md-4 slide-top" ng-if="itemtwo" ng-transclude></div>'
                // template: '<div class="info-container-two slide-top" ng-if="itemtwo" ng-transclude></div>'
        }
    });

    /*********
     *** fab-close button directive ***
     *********/
    app.directive('fabClose', ['$timeout', function($timeout) {
        return {
            restrict: 'C',
            template: '<div class="accent close-button slide-top" ng-click="closeItem()" ng-if="fabBtn"></div>',
            link: function(scope, element, attribute) {
                scope.fabBtn = false;
                $timeout(function() {
                    return scope.fabBtn = true;
                }, 650);
            }
        }
    }]);

    /*********
     *** info-items directive ***
     *********/
    app.directive('infoItems', ['$rootScope', '$timeout', function($rootScope, $timeout) {
        return {
            restrict: 'C',
            transclude: true,
            template: '<ng-transclude ng-click="dataLoad()"></ng-transclude>',
            link: function(scope, element, attribute) {
                element.on('click', function() {
                    $timeout(function() {
                        $rootScope.loadDatas = attribute['path'];
                    }, 200);
                })
            }
        }
    }]);

    /*********
     *** nav-home directive ***
     *********/
    app.directive('navHome', ['$rootScope', function($rootScope) {
        return {
            restrict: 'C',
            link: function(scope, element, attribute) {
                $rootScope.views = attribute['path'];
            }
        }
    }]);


    /*********
     *** personal-map directive ***
     *********/
    app.directive('personalMap', ['$rootScope', '$sce', function($rootScope, $sce) {
        return {
            restrict: 'C',
            transclude: true,
            template: '<iframe frameborder="0" style="border:0" ng-src="{{theURL()}}" allowfullscreen></iframe>',
            link: function(scope, element, attribute) {
                scope.latitude = attribute['latitude'];
                scope.longitude = attribute['longitude'];
                scope.api = attribute['api'];
                scope.zoom = attribute['zoom'];
                scope.zoomNum = function(e) {
                    if (e > 15) {
                        return 15;
                    } else if (e < 0) {
                        return 0;
                    } else {
                        return e;
                    };
                }
                scope.theUrl = 'https://www.google.com/maps/embed/v1/place?q='
                scope.theUL = $sce.trustAsResourceUrl(scope.theUrl)
                scope.theURL = function() {
                    return $sce.trustAsResourceUrl(scope.theUL + scope.latitude + '%2C' + scope.longitude + '&key=' + scope.api + '&zoom=' + scope.zoomNum(scope.zoom))
                }
            }
        }
    }]);

    /*********
     *** load data directive ***
     *********/
    app.directive('loadData', ['$rootScope', '$timeout', '$location', function($rootScope, $timeout, $location) {
        return {
            restrict: 'C',
            transclude: true,
            template: '<div ng-click="closeMenu()" ng-transclude></div>',
            link: function(scope, element, attribute) {
                element.on('click', function() {
                    $location.path('/').hash('')
                    scope.loader = true;
                    $timeout(function() {
                        scope.loader = false;
                    }, 600);
                    $rootScope.menu = false;
                    $rootScope.views = attribute['path'];
                    scope.itemone = false;
                    $timeout(function() {
                        scope.itemone = true;
                    }, 250);
                    scope.itemtwo = false;
                    $timeout(function() {
                        scope.itemtwo = true;
                    }, 450);
                    scope.$apply();
                })
            }
        }
    }]);

    /*********
     *** blog-items directive ***
     *********/
    app.directive('loadingItems', ['$rootScope', '$location', '$anchorScroll', function($rootScope, $location, $anchorScroll) {
        return {
            restrict: 'C',
            transclude: true,
            template: '<div ng-click="dataLoad()" ng-transclude></div>',
            link: function(scope, element, attribute) {
                element.on('click', function() {
                    $rootScope.menu = true;
                    $rootScope.loadViews = attribute['path'];
                    $location.hash('theMain')
                    $anchorScroll()
                })
            }
        }
    }]);

    /*********
     *** personalWebsiteAppController controller ***
     *********/
    app.controller('personalWebsiteAppController', ['$scope', '$rootScope', '$timeout', '$location', '$anchorScroll', '$http', '$sce', function($scope, $rootScope, $timeout, $location, $anchorScroll, $http, $sce) {
        $scope.colorContainer = false;
        $scope.openColorChanger = function() {
            return $scope.colorContainer = !$scope.colorContainer;
        }
        $rootScope.colors = "css/blue.css";
        $scope.changeColor = function(e) {
            $rootScope.colors = e;
        }
        $rootScope.menu = false;
        $scope.dataLoad = function() {
            $scope.loader = true;
            $timeout(function() {
                $scope.loader = false;

            }, 600);
        }
        $scope.closeMenu = function() {
            leftSide.addClass('closeMobileMenu')
            leftSide.removeClass('openMobileMenu')
        }

        var loads = angular.element(document.querySelector('.loads'));
        $scope.loader = true;
        $timeout(function() {
            loads.css({
                'height': '220px',
                'z-index': 0,
                'opacity': 0
            })
            $scope.loader = false;
        }, 600)

        var leftSide = angular.element(document.querySelector('.left-side'));
        $scope.openMenu = function() {
            leftSide.addClass('openMobileMenu')
            leftSide.removeClass('closeMobileMenu')
        }

        $scope.closeItem = function() {
            $rootScope.menu = false;
            $location.path('/').hash('')
        }
        $rootScope.blog = true;
        $scope.itemone = false;
        $timeout(function() {
            $scope.itemone = true;
        }, 250);
        $scope.itemtwo = false;
        $timeout(function() {
            $scope.itemtwo = true;
        }, 450);
        $scope.loadCont = function(e) {

            $location.path('/').hash('')
            $scope.loader = true;
            $timeout(function() {
                $scope.loader = false;
            }, 600);
            $rootScope.menu = false;
            $rootScope.views = e;
            $scope.itemone = false;
            $timeout(function() {
                $scope.itemone = true;
            }, 250);
            $scope.itemtwo = false;
            $timeout(function() {
                $scope.itemtwo = true;
            }, 450);
            // $scope.$apply();
            console.log(e)
        }


        // Portfolio get json files
        $http.get('json/portfolio.json')
            .then(function(res) {
                $scope.mainpPortfolio = res.data.portfolio;
                $scope.mainBlog = res.data.blog;
            });
    }]);

    // trusted url value
    app.filter('trusted', ['$sce', function($sce) {
        return function(url) {
            return $sce.trustAsResourceUrl(url);
        };
    }]);

    /*********
     *** skill-set directive ***
     *********/
    app.directive('skillProgress', ['$rootScope', function($rootScope) {
        return {
            scope: {},
            restrict: 'AC',
            transclude: true,
            template: '<div><h3><ng-transclude></ng-transclude></h3><div class="progres"><div class="primary determinate" ng-style="{\'width\' : progressPersentages}"><i class="fa primary-font fa-circle"></i></div></div></div>',
            link: function(scope, element, attribute) {
                var progressPersent = attribute['progressPersentage']
                scope.progressPersentages = progressPersent
                scope.$apply
            }
        };
    }]);
})();
