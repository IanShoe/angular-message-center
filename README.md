angular-message-center
======================

Easy Angular Notification Center

This is an angular module that allows for easy message broadcasting as notification bubbles. The module has two importance levels which are styled differently through the message-center.css file. The css is meant to be tailored by the user for their specific needs. Oh and it's also responsive!

Use Steps:

1. bower install angular-message-center

2. Add the `<script>` tag and `<link>` on your index.html

3. Add the required dependancy to your app.js file `var yourApp = angular.module('your-app', ['MessageCenter']);`

4. Inject the MessageService into your controllers, directives, or other services `yourApp.controller('myCtrl', ['$scope', 'MessageService', function($scope, MessageService){...}])`

5. Broadcast a message by calling `MessageService.broadcast('This is an awesome message', opts)`

Opts can be ommited and I currently only support setting `{important: true}`

You may also disable notifications via `MessageService.config({disabled:true})`

You can view a demo of my module at http://develementz.com/module
