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

.directive('messageCenter', function($timeout, MessageService) {

  function removeById(array, item) {
    var index;
    for (var i = 0; i < array.length; i++) {
      if (array[i].id === item.id) {
        index = i;
        break;
      }
    }
    if (index !== -1) {
      array.splice(index, 1);
    }
    return array;
  }

  function processQueue(q, list) {
    if (q.length === 0 || list.length >= MessageService.config.max) {
      return;
    }
    var nextMsg = q.shift();
    list.push(nextMsg);
    $timeout(function() {
      removeById(list, nextMsg);
      if (q.length > 0) {
        processQueue(q, list);
      }
    }, nextMsg.timeout);
  }

  var counter = 0;

  return {
    restrict: 'E',
    scope: {},
    templateUrl: 'templates/message-center/message-center.html',
    controller: function($scope) {
      $scope.removeItem = function(message) {
        // Maybe have a reference to the timeout on message for easier cancelling
        message.type ? removeById($scope.impMessages, message) : removeById($scope.messages, message);
      };
    },
    link: function(scope) {
      scope.messages = [];
      scope.impMessages = [];
      scope.position = MessageService.config.position;
      var queue = [];
      var impQueue = [];
      MessageService.registerListener('broadcast', function(msg, opts) {
        opts = opts || {};
        var message = {
          classes: [],
          message: msg,
          id: counter++,
          timeout: (angular.isDefined(opts.timeout) && angular.isNumber(opts.timeout)) ? opts.timeout : MessageService.config.timeout
        };
        if (opts) {
          if (opts.important) {
            message.type = 'important';
          }
          if (opts.color) {
            message.classes.push(opts.color);
          }
        }
        var q, list;
        if (message.type) {
          q = impQueue;
          list = scope.impMessages;
        } else {
          q = queue;
          list = scope.messages;
        }
        scope.$apply(function() {
          q.push(message);
          processQueue(q, list);
        });
      });
    }
  };
})

.directive('messageItem', function() {
  return {
    replace: true,
    restrict: 'E',
    templateUrl: 'templates/message-center/message-item.html'
  };
});
