angular.module("template/message-center/message-center.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/message-center/message-center.html",
    '<span>' +
        '<span class="message-center-important">' +
            '<message ng-repeat="messageItem in impMessageItems" class="message-animation"></message>' +
        '</span>' +
        '<span class="message-center-regular">' +
            '<message ng-repeat="messageItem in messageItems" class="message-animation"></message>' +
        '</span>' +
    '<span>');
}]);

angular.module("template/message-center/message.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/message-center/message.html",
    '<div class="message-box" ng-class="messageItem.class">' +
        '<button type="button" class="close" aria-hidden="true" ng-click="removeItem(messageItem)">&times;</button>' +
        '<span class="message-item">{{messageItem.message}}</span>' +
    '</div>');
}]);