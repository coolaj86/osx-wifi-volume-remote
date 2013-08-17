(function () {
  'use strict';

  // TODO use spawn instead of exec so that we can KILL it sometimes when we want to!
  var exec = require('child_process').exec
    , os = require('os')
    , fs = require('fs')
    , path = require('path')
    , unroll = require('./stepper').unroll
    , tmpdir = os.tmpdir()
    , filepath = path.join(tmpdir, 'osx-wifi-volume-remote.tmp.applescript')
    , MIN_VAL = -1
    , MAX_VAL = 100
    , MIN_STEP = 1
      // must not be <= 0
    , MIN_TIMEOUT = 30 // FYI: exec takes about 90ms
    , timeouts = []
    , callbacks = {}
    ;

  console.log(filepath);

  function mute(cb, time) {
    // get the current volume level
    get(function (err, cur) {
      // change the level to -1 (0 and mute)
      fade(function () {
        // set the volume level back while preserving mutedness
        setRaw(cb, cur, true);
      }, -1, time);
    });
    /*
    exec('osascript -e "set volume with output muted"', function (err, stdout, stderr) {
      cb(err || stderr);
    });
    */
  }
  function unmute(cb, time, vol) {
    get(function (err, cur) {
      if ('number' === typeof vol) {
        cur = vol;
      }
      // set to zero, unmuted
      setRaw(function () {
        // fade back to the current value
        fade(cb, cur, time);
      }, -1, false);
    });
    /*
    exec('osascript -e "set volume without output muted"', function (err, stdout, stderr) {
      cb(err || stderr);
    });
    */
  }

  function setRaw(cb, num, muted) {
    var cmd
      ;

    // Allow 0 to be the lowest volume setting and -1 to be off
    num = num || 0.1;
    if (muted || num === -1) {
      // mutes volume at 0
      //cmd = 'osascript -e "set volume output volume ' + num + ' --100%"';
      // allows volume to be set to 0 without muting
      cmd = 'osascript -e "set volume with output muted output volume ' + num + ' --100%"';
    } else {
      cmd = 'osascript -e "set volume without output muted output volume ' + num + ' --100%"';
    }

    exec(cmd, function () {
      getRaw(cb);
    });
  }

  //cmd = 'osascript -e "set volume output volume (output volume of (get volume settings) + ' + num + ') --100%"';
  function set(cb, num, mymuted) {
    cancel();
    get(function (err, cur, muted) {
      // OS X BUG
      // The lowest volume setting is 0 < x < 1, but it reads as 0
      // Thus it's not possible to tell muted vs 
      num = parseInt(num, 10);
      // TODO make this an error
      if (isNaN(num)) {
        num = cur;
      }
      if ('undefined' !== typeof mymuted) {
        muted = mymuted;
      }
      setRaw(cb, num, muted);
    });
  }

  function getRaw(cb) {
    exec('osascript -e "output volume of (get volume settings) & output muted of (get volume settings)"', function (err, stdout, stderr) {
      var cur
        , vals
        ;

      stdout = stdout || '';
      vals = stdout.trim().split(/,\s*/);
      if ("0" === vals[0] && "true" === vals[1]) {
        vals[0] = -1;
      }
      cur = parseInt(stdout, 10);
      cb(err || stderr, cur, ("true" === vals[1]));
    });
  }

  // get pushes a timeout, which makes it get cancelled
  function get(cb) {
    getRaw(function (err, num, muted) {
      timeouts.push(setTimeout(function () {
        cb(err, num, muted);
      }), 0);
    });
  }

  // TODO should issue callback
  function cancel() {
    timeouts.forEach(function (timeout) {
      clearTimeout(timeout);
    });
    Object.keys(callbacks).forEach(function (key) {
      callbacks[key]('cancel');
      delete callbacks[key];
    });
    timeouts = [];
  }

  function pushTimeout(cb, interval) {
    var timeout
      ;

    function doStuff() {
      var fn = cb || function () {}
        ;

      // Check that the previous timeout completed before running the next
      /*
      if (!previousCompleted) {
        return;
      }
       */
      fn.apply(null, arguments);
    }

    timeout = setTimeout(doStuff, interval);
    timeouts.push(timeout);
  }

  function changeViaScript(steps, callback) {
    var script = []
      ;

    steps.forEach(function (step) {
      script.push('delay ' + (step.interval / 1000));
      script.push('set volume without output muted output volume ' + step.val + ' --100%');
    });

    fs.writeFileSync(filepath, script.join('\n'), 'utf8');
    exec('osascript ' + filepath, function () {
      callback();
    });
  }
  function changeViaExec(steps, callback) {
    steps.forEach(function (step, i) {
      pushTimeout(function () {
        if (i === steps.length - 1) {
          setRaw(callback, step.val);
        } else {
          setRaw(function () { }, step.val);
        }
      }, step.time);
    });
  }

  // This should be done from the perspective
  // that at time x the volume should be at y%
  function fade(cb, level, time) {
    //cancel();
    fadeHelper(cb, level, null, time);
  }
  function fadeBy(cb, delta, time) {
    fadeHelper(cb, null, delta, time);
  }
  function fadeHelper(cb, level, _delta, time) {
    get(function (err, cur) {
      var steps
        , delta
        , callback = get.bind(null, cb)
        , script = []
        ;

      if ('number' === typeof _delta) {
        delta = _delta;
      } else {
        delta = level - cur;
      }

      steps = unroll(cur, delta, time, {
        MIN_STEP: MIN_STEP
      , MIN_TIMEOUT: MIN_TIMEOUT
      , MAX_VAL: MAX_VAL
      , MIN_VAL: MIN_VAL
      });

      if (!steps.length) {
        callback();
      }

      //changeViaExec(steps, callback);
      changeViaScript(steps, callback);
    });
  }

  module.exports.fade = fade;
  module.exports.fadeBy = fadeBy;
  module.exports.mute = mute;
  module.exports.unmute = unmute;
  module.exports.set = set;
  module.exports.get = get;
  module.exports.cancel = cancel;
}());
