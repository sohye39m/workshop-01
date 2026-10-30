// UI: 화면 전환, 자막, 점수·콤보 표시
// 담당: Builder C MinjooSong0708 — 이 파일은 담당자만 수정한다. 인터페이스는 SPEC.md 5장.

var UI = (function () {
  var SCREENS = ['start', 'play', 'result'];
  var startHandler = null;
  var retryHandler = null;

  function byId(id) {
    return document.getElementById(id);
  }

  byId('start-button').addEventListener('click', function () {
    if (startHandler) startHandler();
  });

  byId('retry-button').addEventListener('click', function () {
    if (retryHandler) retryHandler();
  });

  return {
    // name: 'start' | 'play' | 'result'
    showScreen: function (name) {
      SCREENS.forEach(function (screen) {
        byId('screen-' + screen).hidden = screen !== name;
      });
    },

    setSubtitle: function (text) {
      byId('subtitle').textContent = text;
    },

    updateHud: function (hud) {
      byId('hud-score').textContent = hud.score;
      byId('hud-combo').textContent = hud.combo;
    },

    onStart: function (handler) {
      startHandler = handler;
    },

    onRetry: function (handler) {
      retryHandler = handler;
    }
  };
})();
