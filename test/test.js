(function () {
  'use strict';

  var wivol = require('../lib/osascript-vol-ctrl')
    , fade = wivol.fade
    ;

  /*
  get(function (err, num) {
    console.log('Volume is at', num);
  });
  */
  // fade(null, 50, 1);
  // fade(null, 50, 0);
  // fade(null, 50, 20);
  // fade(null, 50, 21);
  // fade(null, 50, 39);
  // fade(null, 50, 40);

  // Increments
  // test the 0ms 1 step
  //fade(null, 1, 1000); // should take 0ms
  // test the 1000ms 2 step
  //fade(null, 2, 1000); // should take 1000ms
  // test the 0ms 3 step
  //fade(null, 3, 0);
  // test some odd numbers
  //fade(null, 11, 3 * 900);
  // test a long fade
  //fade(null, 101, 10 * 60 * 1000);

  // Do nothing
  //fade(null, 0, 1000);

  // Decrements
  wivol.get(function (err, cur, muted) {
    console.log('got vals', cur, muted);
    wivol.fade(function (err, cur, muted) {
      console.log('faded to 30', cur, muted);
      wivol.mute(function (err, cur, muted) {
        console.log('mute', cur, muted);
        setTimeout(function () {

          wivol.unmute(function (err, cur, muted) {
            console.log('unmute', cur, muted);
            wivol.fadeBy(function (err, cur, muted) {
              console.log('faded by -5', cur, muted);
            }, -5, 1000);
          }, 600);

        }, 1000);
      }, 300);
    }, 30, 3000);
  });

  //wivol.mute();
}());
