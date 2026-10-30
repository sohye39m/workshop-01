// GameAudio: WebAudio 박자음·멜로디·효과음
// 담당: Builder A uoona-svg — 이 파일은 담당자만 수정한다. 인터페이스는 SPEC.md 5장.

var GameAudio = (function () {
  var ctx = null;
  var master = null;
  var songNodes = [];

  function ensureContext() {
    if (!ctx) {
      var AC = window.AudioContext || window.webkitAudioContext;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0.6;
      master.connect(ctx.destination);
    }
    return ctx;
  }

  // 짧은 클릭음 하나를 time(오디오 시계 기준 초)에 예약한다
  function scheduleTick(time, freq, volume) {
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(volume, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.06);
    osc.connect(gain);
    gain.connect(master);
    osc.start(time);
    osc.stop(time + 0.08);
    songNodes.push(osc);
  }

  return {
    // 사용자 입력 직후 호출해 AudioContext를 깨운다
    unlock: function () {
      ensureContext();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
    },

    // 오디오 시계 기준 현재 시각(초)
    now: function () {
      return ensureContext().currentTime;
    },

    // 곡 시작: startTime(오디오 시계 기준 초)부터 박마다 박자음을 예약한다
    startSong: function (startTime) {
      ensureContext();
      this.stopSong();
      var bpm = (typeof Chart !== 'undefined' && Chart.bpm) || 120;
      var total = (typeof Chart !== 'undefined' && Chart.totalBeats) || 64;
      var beatLen = 60 / bpm;
      for (var i = 0; i < total; i++) {
        // 4박마다 첫 박은 높은 음으로 강조한다
        var accent = i % 4 === 0;
        scheduleTick(startTime + i * beatLen, accent ? 1200 : 800, accent ? 0.5 : 0.3);
      }
    },

    stopSong: function () {
      songNodes.forEach(function (osc) {
        try { osc.stop(); } catch (e) { /* 이미 끝난 노드 */ }
        osc.disconnect();
      });
      songNodes = [];
    },

    // A3에서 구현
    playHit: function (result) {},
    playCheer: function () {}
  };
})();
