Blacklight.onLoad(function() {
    // This takes care of loading the angular app with Turbolinks
    var app = angular.module('angularApp', ['ngResource', 'ui.sortable'])
        .controller('PageManagerController', ['$scope', '$sce', PageManagerController])
        .directive('pageManager', ['Book', 'Page', PageManagerDirective])
        .factory('Book', ['$resource', BookFactory])
        .factory('Page', ['$resource', PageFactory]);
    angular.bootstrap('body', ['angularApp']);
})

function PageManagerController($scope, $sce) {
    $scope.pages = [];

    $scope.updatePageOrder = function() {
        console.log("updating pages")
        $scope.book.member_ids = $scope.pages.map(function(page) { return page.id });
        $scope.book.$update();
    };

    $scope.imageUrl = function(page) {
        // After image server is set up, use the following line:
        //return $scope.imageServerUrl+ page.id + $scope.thumbnailParams;
        // Until then, use curation_concerns download path:
        return '/downloads/'+page.id+'?file=thumbnail'
    };
}

function PageManagerDirective(Book, Page) {
    function linkingFunction(scope, element, attrs) {
        scope.book = new Book.get( {id: attrs.book}, function (data) {
            scope.imageServerUrl = "http://libimages1.princeton.edu/loris/";
            scope.thumbnailParams = "/full/!150,150/0/default.png"
            json = angular.fromJson(data);
            angular.forEach(json.member_ids, function (page_id, idx) {
              scope.pages[idx] = new Page.get({id: page_id});
            });
        });

    }

    return {
        restrict: 'E',
        templateUrl: 'page_manager.html',
        link: linkingFunction
    };
}

function BookFactory($resource) {
    return $resource("/concern/scanned_books/:id.json", {id:'@id'}, {
        update: { method: 'PUT' }
    });
}

function PageFactory($resource) {
    return $resource("/concern/generic_files/:id.json", {id:'@id'}, {
        update: { method: 'PUT' }
    });
}
