'use strict';

describe('MessageCenter', function(){
	beforeEach(module('MessageCenter'));

	describe('Message Service', function(){
		it('should exist', function(){
			inject(function(MessageService){
				expect(MessageService).toBeDefined();
			});
		});
	});

	describe('Message Service', function(){
		it('should broadcast a message', function(){
			inject(function(MessageService){
				MessageService.broadcast('I am a message');
			});
		});
	});
});