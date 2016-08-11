<a name="1.4.0"></a>
# 1.4.0 Meaningful Mutilation (2016-08-11)

## Bug Fixes
- Fixes z-index for minified file
- Fix html bind issue. Uses angulars $sce

<a name="1.3.3"></a>
# 1.3.3 Nitrous Nucleus (2016-07-27)

## Features
- Replace feature graciously provided by @codyb11989
- Message option now includes `.title`

<a name="1.3.2"></a>
# 1.3.2 Orbital Optics (2016-02-22)

## Features

- Updated Dependencies
- Updated Node Version in travis.yml

<a name="1.3.1"></a>
# 1.3.1 Patient Patrol (2015-11-24)

## Bug Fixes

- Unnecessary $scope.$apply call

<a name="1.3.0"></a>
# 1.3.0 Quaint Quake (2015-11-19)

## Features

- New styling graciously provided by @knassar
- Config now supports positioning (top, bottom, left, right, centered)
- Updated Animations

## Breaking Changes

- 'important' now removed

## Bug Fixes

- Fixed queue processing on item removal and better timing
- fix null opts

<a name="1.2.0"></a>
# 1.2.1 Creature Craft (2015-11-15)

## Bug Fixes

- fix null opts

<a name="1.2.0"></a>
# 1.2.0 Enigmatic Opposition (2015-09-15)

## Features

- updated dependencies
- using gulp
- module to include is now called 'message-center'
- removed backwards compatibility with pages that already included <message-center></message-center> (simply remove from main page to fix)
- MessageService is now stand alone and can facilitate other modules using it
- MessageCenter now utilizes MessageService as if it were a 3rd party plugin

<a name="1.0.5"></a>
# 1.0.5 Gated Gondola (2015-02-14)

## Features

- update bower dependancies

<a name="1.0.4"></a>
# 1.0.4 Good Citizen (2015-01-25)

## Features

- specify main files correctly in bower.json (wiredep compatible)

<a name="1.0.3"></a>
# 1.0.3 Teeming Caravan (2014-04-27)

## Features

- service now provides convenience methods: .info, .danger, .error, .success, .warn(ing)

<a name="1.0.2"></a>
# 1.0.2 Coffee Correction (2013-12-03)

## Features

- message-center.css now in the dist folder
- adding disabled history rather than logging message in console
- removed all other console.log messages

<a name="1.0.1"></a>
# 1.0.1 Convenience Machine (2013-11-05)

## Features

- No longer required to add `<message-center></message-center>` tag to your page
	- If already present, a duplicate is not created. Will be changed in a later version.

<a name="1.0.0"></a>
# 1.0.0 Breakout Sketch (2013-11-01)

## Features

- Broadcast any message with `MessageService.broadcast('This is an awesome message', opts)`
- Options can be set to `{color: 'primary', important:true}`
- Global Message Service Config can be set via `MessageService.config({disabled:false, max:3, timeout:3000})`
