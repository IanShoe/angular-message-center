angular.module('test', [
  'message-center'
])

.controller('IndexCtrl', function ($timeout, MessageService) {
  $timeout(function () {
    MessageService.broadcast({
      message: 'test',
      title: 'Title'
    }, {
      color: 'success'
    });
  }, 1000);
  $timeout(function () {
    MessageService.error({
      message: 'test',
      title: 'Title'
    });
  }, 2000);
  $timeout(function () {
    MessageService.warn({
      message: 'test',
      title: 'Title'
    });
  }, 3000);
});
