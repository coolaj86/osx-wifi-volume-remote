function throttle (callback, limit) {
  var wait = false;
  return function () {
    if (!wait) {
      callback.apply(null, arguments);
      wait = true;
      setTimeout(function () {
        wait = false;
      }, limit);
    }
  };
}


var isSettingVolume = false;
function setVolume (wantedVolume) {
  if (isSettingVolume) {
    return;
  }
  console.log(wantedVolume);
  var val = wantedVolume * 100;
  isSettingVolume = true;
  $.get('/controls/volume/' + val, function (data) {
    volume = data.volume / 100;
    isSettingVolume = false;
    updateSlider();
  });
}
var volume = 0.2;
var setVolumeSlider;
function touchmove (e) {
  console.log(e.target, setVolumeSlider)
  if (!e.target.contains(setVolumeSlider)) {
    e.preventDefault();
  }
}
function updateVolume () {
  if (isSettingVolume) {
    return;
  }
  $.get('/controls/volume', function (data) {
    volume = data.volume / 100;
    updateSlider();
  });
}
function updateSlider () {
  $('.js-real-volume').val(volume);
}
function init () {
  window.scrollTo(0, 0);
  $(window).on({
    touchmove: touchmove,
  });
  setVolumeSlider = $('.js-set-volume').on('change', function () {
    setVolume(this.value);
  }).get(0);
  updateVolume();
  setInterval(updateVolume);
}
$(init);