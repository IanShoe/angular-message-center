angular.module('message.service')

.factory('MessageService', ['$rootScope', function($rootScope) {

  var MessageService = function(config) {
    this.config = {
      disabled: false,
      max: 3,
      timeout: 3000
    };
    this.counter = 0;
    this.disabledHistory = [];
    this.history = [];
    this.listeners = {
      broadcast: {},
      disable: {},
      info: {},
      danger: {},
      error: {},
      success: {},
      warning: {}
    };
    angular.extend(this.config, config);
  };

  MessageService.registerListener(topic, fn) {
    // TODO: build a resolution dictionary
  }

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
    this.counter = 0;
  };

  MessageService.prototype.broadcast = function(msg, opts) {
    if (this.config.disabled) {
      this.disabledHistory.push({
        message: msg,
        opts: opts
      });
      return;
    }
    this.counter++;
    var message = {
      classes: [],
      message: msg,
      id: this.counter,
      timeout: MessageService.config.timeout
    };
    if (opts) {
      if (opts.important) {
        message.type = 'important';
      }
      if (opts.color) {
        message.classes.push(opts.color);
      }
      if (angular.isDefined(opts.timeout) && angular.isNumber(opts.timeout)) {
        message.timeout = opts.timeout;
      }
    }
    this.history.push(message);
    $rootScope.$broadcast('MessageService.broadcast', message);
  };

  MessageService.prototype.info = function(msg, opts) {
    opts = opts || {};
    opts.color = 'info';
    this.broadcast(msg, opts);
  };

  MessageService.prototype.danger = function(msg, opts) {
    opts = opts || {};
    opts.color = 'danger';
    this.broadcast(msg, opts);
  };

  MessageService.prototype.error = function(msg, opts) {
    opts = opts || {};
    opts.color = 'danger';
    this.broadcast(msg, opts);
  };

  MessageService.prototype.success = function(msg, opts) {
    opts = opts || {};
    opts.color = 'success';
    this.broadcast(msg, opts);
  };

  MessageService.prototype.warn = function(msg, opts) {
    opts = opts || {};
    opts.color = 'warning';
    this.broadcast(msg, opts);
  };

  MessageService.prototype.warning = function(msg, opts) {
    opts = opts || {};
    opts.color = 'warning';
    this.broadcast(msg, opts);
  };

  return new MessageService();
}]).
