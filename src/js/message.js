angular.module('message-item')

.directive('messageItem', [function() {
  return {
    replace: true,
    restrict: 'E',
    templateUrl: 'template/message-center/message-item.html'
  };
}]);
