angular-message-center
======================

Easy Angular Notification Center

This is an angular module that allows for easy message broadcasting as notification bubbles. The module has two importance levels which are styled differently through the message-center.css file. The css is meant to be tailored by the user for their specific needs. Oh and it's also responsive!

Use Steps:

1. bower install angular-message-center

2. Add the `<script src="bower_components/angular-message-center/message-center.js">` and `<script src="bower_components/angular-message-center/message-center-templates.js">` tag and `<link href="bower_components/angular-message-center/message-center.css">` on your index.html

3. The message center uses ngAnimate so include `<script src="bower_components/angular-animate/angular-animate.js">` on your index.html as well.

4. Add the required dependancy to your app.js file `var yourApp = angular.module('your-app', ['MessageCenter']);`

5. Inject the MessageService into your controllers, directives, or other services `yourApp.controller('myCtrl', ['$scope', 'MessageService', function($scope, MessageService){...}])`

6. Broadcast a message by calling `MessageService.broadcast('This is an awesome message', opts)`

Opts can be ommited and I currently only support setting `{important: true}`

You may also disable notifications via `MessageService.config({disabled:true})`

You can view a demo of my module at http://develementz.com/module
