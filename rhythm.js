// Rhythm: 박 타이머, 판정, 점수·콤보, 이벤트
// 담당: Builder A uoona-svg — 이 파일은 담당자만 수정한다. 인터페이스는 SPEC.md 5장.

var Rhythm = (function () {
  var TICK_MS = 10;          // 오디오 시계를 확인하는 간격
  var START_DELAY = 0.1;     // start() 직후 곡이 시작되기까지 여유(초)

  var state = { phase: 'idle', beat: 0, score: 0, combo: 0 };
  var handlers = {};
  var timer = null;
  var startTime = 0;         // 박 0의 오디오 시계 시각(초)
  var nextBeat = 0;          // 아직 알리지 않은 가장 앞 박

  function beatLength() {
    return 60 / Chart.bpm;
  }

  function emit(eventName, value) {
    var list = handlers[eventName] || [];
    for (var i = 0; i < list.length; i++) {
      list[i](value);
    }
  }

  function clearTimer() {
    if (timer !== null) {
      clearInterval(timer);
      timer = null;
    }
  }

  // 오디오 시계가 박 시각을 지났으면 beat 이벤트를 보낸다
  function tick() {
    var elapsed = GameAudio.now() - startTime;
    while (nextBeat <= Chart.totalBeats && elapsed >= nextBeat * beatLength()) {
      var b = nextBeat;
      nextBeat++;
      if (b >= Chart.totalBeats) {
        finish();
        return;
      }
      state.beat = b;
      state.phase = b < Chart.countInBeats ? 'countin' : 'playing';
      emit('beat', { beat: b });
    }
  }

  // 곡 끝(박 64)에 도달했을 때. end 이벤트와 등급 계산은 #7에서 채운다.
  function finish() {
    clearTimer();
    GameAudio.stopSong();
    state.phase = 'ended';
  }

  return {
    // 카운트인부터 한 판 시작
    start: function () {
      clearTimer();
      GameAudio.unlock();
      state = { phase: 'countin', beat: 0, score: 0, combo: 0 };
      nextBeat = 0;
      startTime = GameAudio.now() + START_DELAY;
      GameAudio.startSong(startTime);
      timer = setInterval(tick, TICK_MS);
    },

    stop: function () {
      clearTimer();
      GameAudio.stopSong();
      state = { phase: 'idle', beat: 0, score: 0, combo: 0 };
    },

    // 스페이스 입력: 판정은 #6에서 채운다
    press: function () {},

    on: function (eventName, handler) {
      if (!handlers[eventName]) {
        handlers[eventName] = [];
      }
      handlers[eventName].push(handler);
    },

    getState: function () {
      return { phase: state.phase, beat: state.beat, score: state.score, combo: state.combo };
    }
  };
})();
