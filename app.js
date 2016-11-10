angular.module('test', [
  'message-center'
])

.controller('IndexCtrl', function ($timeout, MessageService) {
  MessageService.configure({
    timeout: 1500
  });
  $timeout(function () {
    MessageService.broadcast({
      message: 'broadcast',
      title: 'Broadcast'
    });
  }, 500);
  $timeout(function () {
    MessageService.success({
      message: 'success',
      title: 'Success'
    });
  }, 1000);
  $timeout(function () {
    MessageService.info({
      message: 'info',
      title: 'Info'
    });
  }, 1500);
  $timeout(function () {
    MessageService.warn({
      message: 'warn',
      title: 'Warn'
    });
  }, 2000);
  $timeout(function () {
    MessageService.warning({
      message: 'warning',
      title: 'Warning'
    });
  }, 2500);
  $timeout(function () {
    MessageService.danger({
      message: 'danger',
      title: 'Danger'
    });
  }, 3000);
  $timeout(function () {
    MessageService.error({
      message: 'error',
      title: 'Error'
    });
  }, 3500);
});
