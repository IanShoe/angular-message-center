<a name="1.0.1"></a>
# 1.0.1 Convenience Machine (2013-11-05)

## Features

- No long required to add `<message-center></message-center>` tag to your page
	- If already present, a duplicate is not created. Will be changed in a later version.

<a name="1.0.0"></a>
# 1.0.0 Breakout Sketch (2013-11-01)

## Features

- Broadcast any message with `MessageService.broadcast('This is an awesome message', opts)`
- Options can be set to `{color: 'primary', important:true}`
- Global Message Service Config can be set via `MessageService.config({disabled:false, max:3, timeout:3000})`