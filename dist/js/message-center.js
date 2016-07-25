angular.module('message-center.service', []);

angular.module('message-center', [
  'ngAnimate',
  'message-center.service',
  'message-center.templates'
])

.run(["$compile", "$document", "$rootScope", function($compile, $document, $rootScope) {
  var messageCenterElem = $compile('<message-center></message-center>')($rootScope);
  $document.find('body').append(messageCenterElem);
}])

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
    controller: ["$scope", "$timeout", "MessageService", function($scope, $timeout, MessageService) {
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
        msg = msg || {};
        if (!angular.isObject(msg)) {
          msg = {
            message: msg
          };
        }
        opts = opts || {};
        var message = {
          classes: [],
          id: counter++,
          title: msg.title,
          message: msg.message,
          timeout: (angular.isDefined(opts.timeout) && angular.isNumber(opts.timeout)) ? opts.timeout : MessageService.config.timeout
        };
        if (opts && opts.color) {
          message.classes.push(opts.color);
        }
        if ( MessageService.config.replace) {
          $scope.messages.splice(0, $scope.messages.length);
          $scope.messages.push(message);
          if (angular.isDefined(opts.timeout)) {
            $timeout(function () {
              $scope.messages.splice(0, $scope.messages.length);
            }, opts.timeout);
          }
        } else {
          queue.push(message);
          processQueue();
        }        
      });
    }],
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

(function(module) {
try {
  module = angular.module('message-center.templates');
} catch (e) {
  module = angular.module('message-center.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('templates/message-center/message-center.html',
    '<span class="message-center" ng-class="position">\n' +
    '  <ul class="messages">\n' +
    '    <message-item ng-repeat="message in messages" class="message-animation"></message-item>\n' +
    '  </ul>\n' +
    '</span>\n' +
    '');
}]);
})();

angular.module('message-center.service')

.factory('MessageService', function() {

  var messageCenterPositions = {
    TopLeft: "top left",
    TopRight: "top right",
    BottomLeft: "bottom left",
    BottomRight: "bottom right",
    Centered: "centered",
  };

  var MessageService = function(config) {
    this.config = {
      position: messageCenterPositions.TopRight,
      disabled: false,
      max: 3,
      timeout: 3000,
      replace: false
    };
    this.disabledHistory = [];
    this.history = [];
    this.listeners = {
      broadcast: [],
      disable: [],
      info: [],
      error: [],
      success: [],
      warning: []
    };
    angular.extend(this.config, config);
  };

  MessageService.prototype.Position = messageCenterPositions;

  MessageService.prototype.registerListener = function(topic, fn) {
    if (topic === 'warn') {
      topic = 'warning';
    }
    if (!this.listeners[topic]) {
      throw new Error('Topic ' + topic + ' not supported');
    }
    this.listeners[topic].push(fn);
  };

  MessageService.prototype.configure = function(config) {
    angular.extend(this.config, config);
  };

  MessageService.prototype.getHistory = function() {
    return this.history;
  };

  MessageService.prototype.getDisabledHistory = function() {
    return this.disabledHistory;
  };

  MessageService.prototype.clearHistory = function() {
    this.history = [];
  };

  MessageService.prototype.broadcast = function(msg, opts) {
    var msgObj = {
      message: msg,
      opts: opts
    };
    if (this.config.disabled) {
      this.disabledHistory.push(msgObj);
    } else {
      this.history.push(msgObj);
    }
    this.listeners.broadcast.forEach(function(fn) {
      fn(msg, opts);
    });
  };

  MessageService.prototype.danger = function(msg, opts) {
    opts = opts || {};
    opts.color = 'danger';
    this.listeners.danger.forEach(function(fn) {
      fn(msg, opts);
    });
    this.broadcast(msg, opts);
  };

  MessageService.prototype.error = function(msg, opts) {
    opts = opts || {};
    opts.color = 'danger';
    this.listeners.error.forEach(function(fn) {
      fn(msg, opts);
    });
    this.broadcast(msg, opts);
  };

  MessageService.prototype.info = function(msg, opts) {
    opts = opts || {};
    opts.color = 'info';
    this.listeners.info.forEach(function(fn) {
      fn(msg, opts);
    });
    this.broadcast(msg, opts);
  };

  MessageService.prototype.success = function(msg, opts) {
    opts = opts || {};
    opts.color = 'success';
    this.listeners.success.forEach(function(fn) {
      fn(msg, opts);
    });
    this.broadcast(msg, opts);
  };

  function warning(msg, opts) {
    opts = opts || {};
    opts.color = 'warning';
    this.listeners.warning.forEach(function(fn) {
      fn(msg, opts);
    });
    this.broadcast(msg, opts);
  }

  MessageService.prototype.warn = warning;

  MessageService.prototype.warning = warning;

  return new MessageService();
});

(function(module) {
try {
  module = angular.module('message-center.templates');
} catch (e) {
  module = angular.module('message-center.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('templates/message-center/message-item.html',
    '<li class="message-box" ng-class="message.classes">\n' +
    '  <span class="title message" ng-show="message.title">{{message.title}}<br></span>\n' +
    '  <span class="message">{{message.message}}</span>\n' +
    '  <button type="button" class="close" aria-hidden="true" ng-click="removeItem(message)">&times;</button>\n' +
    '</li>\n' +
    '');
}]);
})();
