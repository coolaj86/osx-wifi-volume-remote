OS X WiFi Volume Remote
===

A web-based html5 / node.js app to control OS X system volume from iPhone, Android, etc

<img src="http://i.imgur.com/jnjfDAGl.png" title="beautifully ugly" alt="screenshot" border="1px" style="border: 1px solid black; width: 325px;" />

Installation & Usage
===

1. Get [Node.js](http://nodejs.org#download)

2. Open **Terminal**

3. Install `osx-wifi-volume-remote` like so

        npm install -g osx-wifi-volume-remote

4. Start the server like so (and note that it shows the name of your computer)
        
        osx-wifi-volume-server 4040

3. Type the `http://<your-computer-name>.local:4040/` whatever onto your phone's browser

4. Enjoy controlling your MacBook's volume over wifi!

API Example
===

`npm install osx-wifi-volume-remote`

```javascript
(function () {
  'use strict';
  
  var applvol = require('osx-wifi-volume-remote')
    ;

  // All callbacks have the same arguments
  applvol.get(function (err, volume, muted) {
    console.log('Volume is set to ' + volume + '% and is ' + (muted ? '' : 'not ') + 'muted');
  });
}());
```

API
===

  * `get(cb)` read the current volume level and mute status
  * `fade(cb, level, duration)` specify a volume level to fade to
  * `fadeBy(cb, difference, duration)` specify a positive or negative difference in volume to fade to
  * `mute(cb, duration)` fades to 0, mutes, then restores volume while muted
  * `unmute(cb, duration)` sets volume to 0, unmutes, then fades back in to volume level
  * `set(cb, level)` hard set a volume without fading
  * all callbacks have the arguments `err, volume, muted`

NOTE: The callbacks all must come first (it was just easier to write the code that way).

Development
===

If you want to develop, here's the clone and build process:

    git clone https://github.com/coolaj86/osx-wifi-volume-remote.git
    pushd osx-wifi-volume-remote

    npm install -g jade
    jade browser/index.jade; mv browser/index.html public/

    npm install
    node app 4040
