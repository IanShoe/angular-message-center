angular-message-center
======================

Easy Angular Notification Center
---------

This is an angular module that allows for easy message broadcasting as notification alerts. The module has two importance levels which are styled differently through the message-center.css file. The css is meant to be tailored for specific needs and serves only as a baseline. The templates are run through angular's $templateCache for portability.

I support a few options for both the message service and the messages themselves
Message Service Opts:
---------
`MessageService.configure({disabled:false, max:3, timeout:3000})`

Message Opts:
---------
`MessageService.broadcast('My Message',{color: 'primary', important:true})`

Oh and it's also responsive!

Installation
---------

1. bower install angular-message-center

2. Add the `<script src="bower_components/angular-message-center/message-center.js">` and `<script src="bower_components/angular-message-center/message-center-templates.js">` script tags and `<link href="bower_components/angular-message-center/message-center.css">` on your index.html

3. The message center uses ngAnimate so include `<script src="bower_components/angular-animate/angular-animate.js">` on your index.html as well.

4. Add the directive tag to your page `<message-center></message-center>` usually at the end of body.

5. Add the required dependancy to your app.js file `var yourApp = angular.module('your-app', ['MessageCenter']);`

6. Inject the MessageService into your controllers, directives, or other services `yourApp.controller('myCtrl', ['$scope', 'MessageService', function($scope, MessageService){...}])`

7. Broadcast a message by calling `MessageService.broadcast('This is an awesome message', opts)`

You can view a demo of my module [here](http://develementz.com/module)
