angular.module('MessageCenter', []).
factory('MessageService', function ($rootScope) {
    var counter = 0;

    var MessageService = {};
    MessageService.config = {
        disabled: false
    }

    MessageService.history = [];

    MessageService.configure = function(config){
        this.config.disabled = angular.isDefined(config.disabled) ? config.disabled : this.config.disabled;
    }

    MessageService.broadcast = function (message, opts) {
        if(!this.config.disabled){
            counter++;
            var messageItem = {};
            if(message.length > 26){
                messageItem.class = 'large';
            }
            else if(message.length < 18){
                messageItem.class = 'small';
            }
            if(opts){
                if(opts.important){
                    messageItem.type = 'important'
                }
            }
            messageItem.message = message;
            messageItem.id = counter;
            this.history.push(messageItem);
            $rootScope.$broadcast('MessageService.broadcast', messageItem);
        }
        else {
            console.log('Message Service Disabled for message: '+ message);
        }
    };

    MessageService.getHistory = function(){
        return this.history;
    }

    MessageService.clearHistory = function(){
        this.history = [];
        counter = 0;
    }
    
    return MessageService;
}).
directive('messageCenter', function ($timeout) {
    return {
        restrict: 'E',
        scope: {},
        template:   '<span>' +
                        '<span class="message-center-important">' +
                            '<message ng-repeat="messageItem in impMessageItems" class="message-animation"></message>' +
                        '</span>' +
                        '<span class="message-center-regular">' +
                            '<message ng-repeat="messageItem in messageItems" class="message-animation"></message>' +
                        '</span>' +
                    '<span>',
        controller: function ($scope, $attrs, MessageService) {
            $scope.messageItems =  [];
            $scope.impMessageItems =  [];
            $scope.$on('MessageService.broadcast', function (event, message) {
                message.type ? $scope.impMessageItems.push(message) : $scope.messageItems.push(message);
                $timeout(function(){
                    $scope.removeItem(message);
                }, 3000);
            });
            $scope.removeItem = function (message){
                $scope.$emit('MessageService.remove', message);
                message.type ? $scope.impMessageItems.remove(message) : $scope.messageItems.remove(message);
            }
        }
    };
}).
directive('message', function () {
    return {
        replace: true,
        restrict: 'E',
        template:   '<div class="message-box" ng-class="messageItem.class">' +
                        '<button type="button" class="close" aria-hidden="true" ng-click="removeItem(messageItem)">&times;</button>' +
                        '<span class="message-item">{{messageItem.message}}</span>' +
                    '</div>'
    };
});

Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};