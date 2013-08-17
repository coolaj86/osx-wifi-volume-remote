(function () {
  'use strict';

  // unroll a loop of changing from one value to another over time
  //
  // This is pretty much only truly useful when background fading music in the browser
  // but it also turns out to be necessary if the music is allowed to play in a background tab
  //
  // You can get wonderfully fine-grained volume controls this way, btws
  /*
   * max = 1000
   *              // cur delta time
   * loops = unroll(50, -20, 1000, { MAX_VAL: max })
   * first = loops.shift();
   *
   * // The first one
   * if (first) {
   *   setVolume(first.val / max); // convert to float (as volume is 0 < x < 1)
   * }
   *
   * // If there are no more
   * if (0 === loops.length) {
   *   callback('volume was already at ' + first.val);
   * }
   *
   * // The middle ones
   * loops.forEach(function (step, i) {
   *   setTimeout(function () {
   *     setVolume(step.val / max);
   *   }, step.time);
   *
   *   if (i === loops.length - 1) {
   *     // The last one
   *     callback('volume set to ' + last.val);
   *   }
   * });
   */
  // WARNING: MIN_STEP and step MUST be integers
  function unroll(cur, delta, time, CONSTS) {
    CONSTS = CONSTS || {};
    var MAX_VAL = CONSTS.MAX_VAL || 100
      , MIN_VAL = CONSTS.MIN_VAL || 0
      , MIN_STEP = CONSTS.MIN_STEP || 1
      , MIN_TIMEOUT = CONSTS.MIN_TIMEOUT || 0
      , steps = []
      , finalVal
      , finalTime
      , step
      , interval
      , howmany
      , absdelta
      , result
      ;

    finalVal = cur + delta; // or cur - delta
    finalTime = time;

    // normalize values
    finalVal = Math.min(MAX_VAL, finalVal);
    finalVal = Math.max(MIN_VAL, finalVal);
    delta = finalVal - cur;

    if (!delta) {
      return steps;
    }

    // TODO
    // The final timeout should be the longest
    // If the value is decreasing, the last change should be the smallest
    // If the value is increasing, the first change should be the smallest
    do {
      result = {};
      absdelta = Math.abs(delta);
      // assume this will take as 
      howmany = Math.floor(time / MIN_TIMEOUT);
      howmany = Math.max(1, howmany);

      // do the minimum possible step
      // minimum step is 1% (in this case)
      // minimum time is 1ms
      // i.e. 20 / 1000
      // i.e. 100 / 10 -- rare case
      step = Math.floor(absdelta / howmany);
      if (step < MIN_STEP) {
        step = MIN_STEP;
        howmany = Math.max(Math.ceil((absdelta || 1) / step), 1);
      }

      // decide the shortest interval
      interval = Math.floor(time / Math.max(howmany - 1, 1));
      interval = Math.max(MIN_TIMEOUT, interval);

      if (delta >= 0) {
        delta -= step;
        result.val = finalVal - delta;
      } else {
        delta += step;
        result.val = finalVal - delta;
      }

      result.time = finalTime - time;
      result.step = step;
      result.interval = interval;
      // TODO find the correct way to exit this loop
      if (!isNaN(result.val)) {
        steps.push(result);
      }

      time -= interval;
    } while ((finalVal - delta !== finalVal) && (absdelta + step > MIN_STEP) && (time + interval > MIN_TIMEOUT));

    if (0 === steps.length || steps[steps.length - 1].val !== finalVal) {
      steps.push({
        val: finalVal
      , time: finalTime
      , step: step || MIN_STEP
      , interval: interval || MIN_TIMEOUT
      });
    }

    return steps;
  }

  module.exports.unroll = unroll;
}());
