OS X WiFi Volume Remote
===

A web-based html5 / node.js app to control OS X system volume from iPhone, Android, etc

Installation & Usage
===

1. Get [Node.js](http://nodejs.org#download)

2. Get this code and start the server

        git clone https://github.com/coolaj86/osx-wifi-volume-remote.git
        pushd osx-wifi-volume-remote
        npm install -g jade
        npm install express
        jade browser/index.jade; mv browser/index.html public/
        node app 4040

3. Type the `http://<your-computer-name>.local:4040/` whatever onto your phone's browser

4. Control your MacBook's volume over wifi!
