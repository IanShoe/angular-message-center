angular.module('MessageCenter', ['ngAnimate','template/message-center/message.html', 'template/message-center/message-center.html']).
factory('MessageService', ['$rootScope', function ($rootScope) {

    var MessageService = {};
    MessageService.config = {
        disabled: false,
        max: 3,
        timeout: 3000
    };

    var history = [];
    var counter = 0;

    MessageService.configure = function(config){
        //need to make sure that omitted values don't override current values
        this.config.disabled = angular.isDefined(config.disabled) ? config.disabled : this.config.disabled;
        this.config.max = angular.isDefined(config.max) ? config.max : this.config.max;
        this.config.timeout = angular.isDefined(config.timeout) ? config.timeout : this.config.timeout;
    };

    MessageService.broadcast = function (msg, opts) {
        if(!this.config.disabled){
            counter++;
            var message = {
                classes: [],
                message: msg,
                id: counter,
                timeout: MessageService.config.timeout
            };
            if(opts){
                if(opts.important){
                    message.type = 'important';
                }
                if(opts.color){
                    message.classes.push(opts.color);
                }
                if(angular.isDefined(opts.timeout) && angular.isNumber(opts.timeout)){
                    message.timeout = opts.timeout;
                }
            }
            history.push(message);
            $rootScope.$broadcast('MessageService.broadcast', message);
        }
        else {
            console.log('Message service disabled for message: '+ msg);
        }
    };

    MessageService.getHistory = function(){
        return history;
    }

    MessageService.clearHistory = function(){
        history = [];
        counter = 0;
    };
    
    return MessageService;
}]).
directive('messageCenter', ['$timeout', 'MessageService', function ($timeout, MessageService) {
    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'template/message-center/message-center.html',
        controller: ['$scope', function($scope){
            $scope.removeItem = function(message){
                // Maybe have a reference to the timeout on message for easier cancelling
                message.type ? remove($scope.impMessages, message) : remove($scope.messages, message);
            }
        }],
        link: function (scope) {

            scope.messages =  [];
            scope.impMessages =  [];
            var queue = [];
            var impQueue = [];

            scope.$on('MessageService.broadcast', function (event, message) {
                var q, list;
                if(message.type){
                    q = impQueue;
                    list = scope.impMessages;
                }
                else {
                    q = queue;
                    list = scope.messages;
                }
                q.push(message);
                if(list.length < MessageService.config.max && q.length == 1){
                    // if it's the first item and the max hasn't been hit yet, then start processing
                    processQueue(q, list);
                }
                else{
                    console.log('saved '+ message.id + ' to queue');
                }
            });

            function processQueue(q, list){
                if(q.length == 0){
                    return;
                }
                var nextMsg = q.shift();
                list.push(nextMsg);
                console.log('adding message ' + nextMsg.id);
                
                $timeout(function(){
                    remove(list, nextMsg);
                    if(q.length > 0){
                        console.log('about to add' + nextMsg.id);
                        $timeout(function(){
                            processQueue(q, list);
                        }, 300);
                    }
                }, nextMsg.timeout);
            }
        }
    };
    function remove(array, item){
        var index = array.indexOf(item);
        if(index != -1){
            array.splice(index, 1);
        }
        return array;
    };
}]).
directive('message', [function () {
    return {
        replace: true,
        restrict: 'E',
        templateUrl: 'template/message-center/message.html'
    };
}]);
angular.module("template/message-center/message-center.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/message-center/message-center.html",
    '<span>' +
        '<span class="message-center-important">' +
            '<message ng-repeat="message in impMessages" class="message-animation"></message>' +
        '</span>' +
        '<span class="message-center-regular">' +
            '<message ng-repeat="message in messages" class="message-animation"></message>' +
        '</span>' +
    '<span>');
}]);

angular.module("template/message-center/message.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/message-center/message.html",
    '<div class="message-box" ng-class="message.classes">' +
        '<span class="message">{{message.message}}</span>' +
        '<button type="button" class="close" aria-hidden="true" ng-click="removeItem(message)">&times;</button>' +
    '</div>');
}]);