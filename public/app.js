window.jQuery(function () {
  'use strict';

  var $ = window.jQuery
    , events = $('body')
    , volume
    ;

  events.on('change', '.js-volume', function (ev) {
    ev.preventDefault();
    ev.stopPropagation();

    var val = $(this).val()
      ;

    $('.js-volume').val(val);

    // debounce
    if (this.sliderTimeour) clearTimeout(this.sliderTimeour);
    this.sliderTimeour = setTimeout(function(){
      $.get('/controls/volume/' + val, function (data) {
        volume = data.volume;
        $('.js-volume').val(data.volume);
      });
    }, 500);
  });

  events.on('click', '.js-volume-up', function (ev) {
    var val = volume + 2
      ;

    ev.preventDefault();
    ev.stopPropagation();

    $('.js-volume').val(val);

    $.get('/controls/volume/' + val, function (data) {
      volume = data.volume;
      $('.js-volume').val(data.volume);
    });
  });

  events.on('click', '.js-volume-down', function (ev) {
    var val = volume - 2
      ;

    ev.preventDefault();
    ev.stopPropagation();

    $('.js-volume').val(val);

    $.get('/controls/volume/' + val, function (data) {
      volume = data.volume;
      $('.js-volume').val(data.volume);
    });
  });

  events.on('click', '.js-mute', function (ev) {
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
      , now = Date.now()
      ;

    ev.preventDefault();
    ev.stopPropagation();

    $.get('/controls/volume/' + val, function (data) {
      console.log('Changed volume in ' + (Date.now() - now) + 'ms');
      volume = data.volume;
      $('.js-volume').val(data.volume);
    });
  });

  events.on('click', '.js-refresh', function (ev) {
    ev.preventDefault();
    ev.stopPropagation();

    getVolume();
  });

  // Initialize
  function getVolume() {
    $.get('/controls/volume', function (data) {
      volume = data.volume;
      $('.js-volume').val(data.volume);

      if (data.muted) {
        $('.js-mute').hide();
        $('.js-unmute').show();
      } else {
        $('.js-unmute').hide();
        $('.js-mute').show();
      }
    });
  }
  getVolume();
  setInterval(getVolume, 10 * 1000);
});
