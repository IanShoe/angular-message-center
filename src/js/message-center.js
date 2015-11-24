angular.module('message-center.service', []);

angular.module('message-center', [
  'ngAnimate',
  'message-center.service',
  'message-center.templates'
])

.run(function($compile, $document, $rootScope) {
  var messageCenterElem = $compile('<message-center></message-center>')($rootScope);
  $document.find('body').append(messageCenterElem);
})

// TODO: make a MessageCenter Provider for configuration
.directive('messageCenter', function() {

  function removeById(array, item) {
    for (var i = 0; i < array.length; i++) {
      if (array[i].id === item.id) {
        array.splice(i, 1);
        break;
      }
    }
    return array;
  }

  return {
    controller: function($scope, $timeout, MessageService) {
      var counter = 0;
      var queue = [];
      $scope.messages = [];
      $scope.position = MessageService.config.position;

      function processQueue() {
        if (queue.length === 0 || $scope.messages.length >= MessageService.config.max) {
          return;
        }
        var nextMsg = queue.shift();
        $scope.messages.push(nextMsg);
        $timeout(function() {
          removeById($scope.messages, nextMsg);
          if (queue.length > 0) {
            processQueue();
          }
        }, nextMsg.timeout);
      }

      $scope.removeItem = function(message) {
        // Maybe have a reference to the timeout on message for easier cancelling
        $scope.messages = removeById($scope.messages, message);
        processQueue();
      };

      MessageService.registerListener('broadcast', function(msg, opts) {
        opts = opts || {};
        var message = {
          classes: [],
          id: counter++,
          message: msg,
          timeout: (angular.isDefined(opts.timeout) && angular.isNumber(opts.timeout)) ? opts.timeout : MessageService.config.timeout
        };
        if (opts && opts.color) {
          message.classes.push(opts.color);
        }
        queue.push(message);
        processQueue();
      });
    },
    restrict: 'E',
    scope: true,
    templateUrl: 'templates/message-center/message-center.html'
  };
})

.directive('messageItem', function() {
  return {
    replace: true,
    restrict: 'E',
    scope: false,
    templateUrl: 'templates/message-center/message-item.html'
  };
});
