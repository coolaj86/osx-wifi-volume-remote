OS X WiFi Volume Remote
===

A web-based html5 / node.js app to control OS X system volume from iPhone, Android, etc

<img src="http://i.imgur.com/jnjfDAGl.png" title="beautifully ugly" alt="screenshot" border="1px" style="border: 1px solid black; width: 325px;" />

Installation & Usage
===

1. Get [Node.js](http://nodejs.org#download)

2. Get this code and start the server

        npm install -g osx-wifi-volume-remote
        osx-wifi-volume-server 4040

3. Type the `http://<your-computer-name>.local:4040/` whatever onto your phone's browser

4. Control your MacBook's volume over wifi!

API Example
===

      var aplvol = require('osx-wifi-volume-control')
        ;

      // All callbacks have the same arguments
      aplvol.get(function (err, volume, muted) {
        console.log('Volume is set to ' + volume + '% and is ' + (muted ? '' : 'not ') + 'muted');
      });

API
===

  * `get(cb)`
  * `fade(cb, level, duration)`
  * `mute(cb, duration)`
  * `unmute(cb, duration)`
  * `set(cb, level)`
  * all callbacks have the arguments `err, volume, muted`

NOTE: The callbacks all must come first (it was just easier to write the code that way).

Development
===

If you want to develop, here's the clone and build process

    git clone https://github.com/coolaj86/osx-wifi-volume-remote.git
    pushd osx-wifi-volume-remote

    npm install -g jade
    jade browser/index.jade; mv browser/index.html public/

    npm install
    node app 4040
