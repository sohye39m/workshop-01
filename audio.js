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

  var noiseBuffer = null;

  function getNoiseBuffer() {
    if (!noiseBuffer) {
      noiseBuffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.3), ctx.sampleRate);
      var data = noiseBuffer.getChannelData(0);
      for (var i = 0; i < data.length; i++) {
        data[i] = Math.random() * 2 - 1;
      }
    }
    return noiseBuffer;
  }

  // 킥: 낮은 음이 빠르게 떨어지는 둥둥 소리
  function scheduleKick(time, volume) {
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(160, time);
    osc.frequency.exponentialRampToValueAtTime(45, time + 0.12);
    gain.gain.setValueAtTime(volume, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.2);
    osc.connect(gain);
    gain.connect(master);
    osc.start(time);
    osc.stop(time + 0.22);
    songNodes.push(osc);
  }

  // 노이즈 한 방울: 스네어(박수 느낌)와 하이햇에 쓴다
  function scheduleNoise(time, volume, length, filterType, filterFreq) {
    var src = ctx.createBufferSource();
    var filter = ctx.createBiquadFilter();
    var gain = ctx.createGain();
    src.buffer = getNoiseBuffer();
    filter.type = filterType;
    filter.frequency.value = filterFreq;
    gain.gain.setValueAtTime(volume, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + length);
    src.connect(filter);
    filter.connect(gain);
    gain.connect(master);
    src.start(time);
    src.stop(time + length + 0.02);
    songNodes.push(src);
  }

  // 통통 튀는 베이스 한 음
  function scheduleBass(time, freq, length) {
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.35, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + length);
    osc.connect(gain);
    gain.connect(master);
    osc.start(time);
    osc.stop(time + length + 0.02);
    songNodes.push(osc);
  }

  // 4마디(16박) 베이스 음 높이 (Hz), 박마다 한 음
  var BASS_LINE = [
    130.8, 130.8, 130.8, 164.8,
    110.0, 110.0, 110.0, 130.8,
    87.3, 87.3, 87.3, 110.0,
    98.0, 98.0, 98.0, 123.5
  ];

  // i번째 박의 드럼과 베이스를 예약한다
  function scheduleBeat(i, time, beatLen) {
    var inBar = i % 4;
    // 킥은 1, 3박에 (3박은 살짝 약하게)
    if (inBar === 0 || inBar === 2) {
      scheduleKick(time, inBar === 0 ? 0.9 : 0.7);
    }
    // 스네어(박수)는 2, 4박에
    if (inBar === 1 || inBar === 3) {
      scheduleNoise(time, 0.5, 0.14, 'bandpass', 1800);
    }
    // 하이햇은 박마다 한 번, 엇박(반 박 뒤)에 한 번 더 열린 소리로
    scheduleNoise(time, 0.18, 0.04, 'highpass', 7000);
    scheduleNoise(time + beatLen / 2, 0.26, 0.09, 'highpass', 6000);
    // 베이스는 박마다 통통 튀게
    scheduleBass(time, BASS_LINE[i % BASS_LINE.length], beatLen * 0.6);
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
        scheduleBeat(i, startTime + i * beatLen, beatLen);
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
