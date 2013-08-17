window.jQuery(function () {
  'use strict';

  var $ = window.jQuery
    , events = $('body')
    ;

  events.on('change', '.js-volume', function (ev) {
    var val = $(this).val()
      ;

    ev.preventDefault();
    ev.stopPropagation();

    $.get('/controls/volume/' + val, function (data) {
      $('.js-volume').val(data.volume);
    });
  });

  events.on('click', '.js-mute', function (ev) {
    console.log('turbo tastic');

    ev.preventDefault();
    ev.stopPropagation();

    $.get('/controls/mute/', function () {
      $('.js-mute').hide();
      $('.js-unmute').show();
    });
  });
  events.on('click', '.js-unmute', function (ev) {

    ev.preventDefault();
    ev.stopPropagation();

    $.get('/controls/unmute', function () {
      $('.js-mute').show();
      $('.js-unmute').hide();
    });
  });
  events.on('click', '.js-quickset', function (ev) {
    var val = $(this).text()
      ;

    ev.preventDefault();
    ev.stopPropagation();

    $.get('/controls/volume/' + val, function (data) {
      $('.js-volume').val(data.volume);
    });
  });

  // Initialize
  $.get('/controls/volume', function (data) {
    $('.js-volume').val(data.volume);

    if (data.muted) {
      $('.js-mute').hide();
      $('.js-unmute').show();
    } else {
      $('.js-unmute').hide();
      $('.js-mute').show();
    }
  });
});
