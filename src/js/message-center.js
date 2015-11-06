angular.module('message.item', []);
angular.module('message.service', ['message.item']);

angular.module('message.center', [
  'ngAnimate',
  'message.service'
])

.run(['$document', '$compile', '$rootScope', function($document, $compile, $rootScope) {
  // Compile message-center element
  var messageCenterElem = $compile('<message-center></message-center>')($rootScope);
  // Add element to body
  $document.find('body').append(messageCenterElem);
}]);

.directive('messageCenter', ['$timeout', 'MessageService', function($timeout, MessageService) {
  return {
    restrict: 'E',
    scope: {},
    templateUrl: 'template/message-center/message-center.html',
    controller: ['$scope', function($scope) {
      $scope.removeItem = function(message) {
        // Maybe have a reference to the timeout on message for easier cancelling
        message.type ? remove($scope.impMessages, message) : remove($scope.messages, message);
      };
    }],
    link: function(scope) {

      scope.messages = [];
      scope.impMessages = [];
      var queue = [];
      var impQueue = [];

      scope.$on('MessageService.broadcast', function(event, message) {
        var q, list;
        if (message.type) {
          q = impQueue;
          list = scope.impMessages;
        } else {
          q = queue;
          list = scope.messages;
        }
        q.push(message);
        if (list.length < MessageService.config.max && q.length === 1) {
          // if it's the first item in queue and the max hasn't been hit yet, then start processing
          processQueue(q, list);
        }
      });

      function processQueue(q, list) {
        if (q.length === 0) {
          return;
        }
        var nextMsg = q.shift();
        list.push(nextMsg);

        $timeout(function() {
          remove(list, nextMsg);
          if (q.length > 0) {
            $timeout(function() {
              processQueue(q, list);
            }, nextMsg.timeout);
          }
        }, nextMsg.timeout);
      }
    }
  };

  function remove(array, item) {
    var index = array.indexOf(item);
    if (index !== -1) {
      array.splice(index, 1);
    }
    return array;
  }
}]);
