(function () {
  'use strict';

  var aplvol = require('../')
    ;

  // All callbacks have the same arguments
  aplvol.get(function (err, volume, muted) {
    console.log('Volume is set to ' + volume + '% and is ' + (muted ? '' : 'not ') + 'muted');
  });
}());
