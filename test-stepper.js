(function () {
  'use strict';

  var unroll = require('./stepper').unroll
    , steps
    ;

  // unroll(cur, delta, time, CONSTS);
  steps = unroll(30, -20, 1000);
  console.log(steps, steps.length);
  steps = unroll(10, 20, 1000);
  console.log(steps, steps.length);
}());
