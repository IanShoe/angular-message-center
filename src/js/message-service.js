angular.module('message-center.service')

.factory('MessageService', function () {

  var messageCenterPositions = {
    TopLeft: "top left",
    TopRight: "top right",
    BottomLeft: "bottom left",
    BottomRight: "bottom right",
    Centered: "centered",
  };

  var MessageService = function (config) {
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
      danger: [],
      disable: [],
      info: [],
      success: [],
      warning: []
    };
    angular.extend(this.config, config);
  };

  MessageService.prototype.Position = messageCenterPositions;

  MessageService.prototype.registerListener = function (topic, fn) {
    if (topic === 'warn') {
      topic = 'warning';
    }
    if (!this.listeners[topic]) {
      throw new Error('Topic ' + topic + ' not supported');
    }
    this.listeners[topic].push(fn);
  };

  MessageService.prototype.configure = function (config) {
    angular.extend(this.config, config);
  };

  MessageService.prototype.getHistory = function () {
    return this.history;
  };

  MessageService.prototype.getDisabledHistory = function () {
    return this.disabledHistory;
  };

  MessageService.prototype.clearHistory = function () {
    this.history = [];
  };

  MessageService.prototype.broadcast = function (msg, opts) {
    var msgObj = {
      message: msg,
      opts: opts
    };
    if (this.config.disabled) {
      this.disabledHistory.push(msgObj);
    } else {
      this.history.push(msgObj);
    }
    this.listeners.broadcast.forEach(function (fn) {
      fn(msg, opts);
    });
  };

  var MS = new MessageService();

  function convenienceHandler(type, msg, opts) {
    opts = opts || {};
    opts.color = type;
    this.listeners[type].forEach(function (fn) {
      fn(msg, opts);
    });
    this.broadcast(msg, opts);
  }

  MS.danger = convenienceHandler.bind(MS, 'danger');
  MS.error = convenienceHandler.bind(MS, 'danger');
  MS.info = convenienceHandler.bind(MS, 'info');
  MS.success = convenienceHandler.bind(MS, 'success');
  MS.warn = convenienceHandler.bind(MS, 'warning');
  MS.warning = convenienceHandler.bind(MS, 'warning');

  return MS;
});
