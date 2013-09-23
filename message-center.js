angular.module('MessageCenter', []).
factory('MessageService', function ($rootScope) {
    var counter = 0;

    var MessageService = {};
    MessageService.config = {
        disabled: false
    };

    var history = [];

    MessageService.configure = function(config){
        this.config.disabled = angular.isDefined(config.disabled) ? config.disabled : this.config.disabled;
    }

    MessageService.broadcast = function (message, opts) {
        if(!this.config.disabled){
            counter++;
            var messageItem = {};
            // Should probably do this better since I tailored this to my own needs
            // I didn't want the div to automatically grow based on the message size,
            // but rather have distinct cut off points
            if(message.length > 26){
                messageItem.class = 'large';
            }
            else if(message.length < 18){
                messageItem.class = 'small';
            }
            if(opts){
                if(opts.important){
                    messageItem.type = 'important';
                }
            }
            messageItem.message = message;
            messageItem.id = counter;
            history.push(messageItem);
            $rootScope.$broadcast('MessageService.broadcast', messageItem);
        }
        else {
            console.log('Message Service Disabled for message: '+ message);
        }
    };

    MessageService.getHistory = function(){
        return history;
    }

    MessageService.clearHistory = function(){
        history = [];
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
                message.type ? remove($scope.impMessageItems, message) : remove($scope.messageItems, message);
            }

            function remove(array, item){
                var index = array.indexOf(item);
                if(index != -1){
                    array.splice(index, 1);
                }
                return array;
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