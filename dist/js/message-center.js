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

.directive('messageCenter', ["$timeout", "MessageService", function($timeout, MessageService) {

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
    controller: ["$scope", function($scope) {
      $scope.removeItem = function(message) {
        // Maybe have a reference to the timeout on message for easier cancelling
        message.type ? removeById($scope.impMessages, message) : removeById($scope.messages, message);
      };
    }],
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
}])

.directive('messageItem', function() {
  return {
    replace: true,
    restrict: 'E',
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
    '<span class="message-center" ng-class="position"><ul class="messages"><message-item ng-repeat="message in messages" class="message-animation"></message-item></ul></span>');
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
      timeout: 3000
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
    '<li class="message-box" ng-class="message.classes"><span class="message">{{message.message}}</span> <button type="button" class="close" aria-hidden="true" ng-click="removeItem(message)">&times;</button></li>');
}]);
})();
