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

  // 4마디(16박) 멜로디: [시작 박, 음 높이 Hz, 길이(박)]
  // 베이스 코드 진행(C - Am - F - G)에 맞춘 밝은 음들
  var MELODY = [
    [0, 659.3, 0.5], [0.5, 784.0, 0.5], [1, 659.3, 0.5], [1.5, 523.3, 0.5],
    [2, 784.0, 1], [3, 659.3, 1],
    [4, 523.3, 0.5], [4.5, 659.3, 0.5], [5, 880.0, 0.5], [5.5, 659.3, 0.5],
    [6, 523.3, 1], [7, 440.0, 1],
    [8, 698.5, 0.5], [8.5, 880.0, 0.5], [9, 698.5, 0.5], [9.5, 523.3, 0.5],
    [10, 880.0, 1], [11, 698.5, 1],
    [12, 587.3, 0.5], [12.5, 784.0, 0.5], [13, 987.8, 0.5], [13.5, 784.0, 0.5],
    [14, 1046.5, 1.5], [15.5, 784.0, 0.5]
  ];

  // 멜로디 한 음 (통통 튀는 사각파)
  function scheduleLead(time, freq, length) {
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.12, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + length);
    osc.connect(gain);
    gain.connect(master);
    osc.start(time);
    osc.stop(time + length + 0.02);
    songNodes.push(osc);
  }

  // 효과음용 음 하나 (songNodes에 넣지 않아 곡을 멈춰도 끊기지 않는다)
  function playTone(type, freq, endFreq, start, length, volume) {
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    var t = ctx.currentTime + start;
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    if (endFreq !== freq) {
      osc.frequency.exponentialRampToValueAtTime(endFreq, t + length);
    }
    gain.gain.setValueAtTime(volume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + length);
    osc.connect(gain);
    gain.connect(master);
    osc.start(t);
    osc.stop(t + length + 0.02);
  }

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
      // 멜로디는 카운트인이 끝난 본 구간부터 들어온다
      var countIn = (typeof Chart !== 'undefined' && Chart.countInBeats) || 4;
      for (var b = countIn; b < total; b += 16) {
        MELODY.forEach(function (note) {
          var beat = b + note[0];
          if (beat < total) {
            scheduleLead(startTime + beat * beatLen, note[1], note[2] * beatLen * 0.9);
          }
        });
      }
    },

    stopSong: function () {
      songNodes.forEach(function (osc) {
        try { osc.stop(); } catch (e) { /* 이미 끝난 노드 */ }
        osc.disconnect();
      });
      songNodes = [];
    },

    // 판정 효과음: perfect는 올라가는 반짝임, good은 짧은 삑, miss는 낮게 처지는 소리
    playHit: function (result) {
      ensureContext();
      if (result === 'perfect') {
        playTone('triangle', 1318.5, 1318.5, 0, 0.12, 0.35);
        playTone('triangle', 1760.0, 1760.0, 0.07, 0.2, 0.35);
      } else if (result === 'good') {
        playTone('triangle', 880.0, 880.0, 0, 0.14, 0.3);
      } else if (result === 'miss') {
        playTone('sawtooth', 180.0, 90.0, 0, 0.3, 0.25);
      }
    },

    // 함성 효과음: 군중 소리 같은 노이즈가 커졌다 사라지고, 화음이 위로 올라간다
    playCheer: function () {
      ensureContext();
      var t = ctx.currentTime;
      var src = ctx.createBufferSource();
      var filter = ctx.createBiquadFilter();
      var gain = ctx.createGain();
      src.buffer = getNoiseBuffer();
      src.loop = true;
      filter.type = 'bandpass';
      filter.Q.value = 0.8;
      filter.frequency.setValueAtTime(500, t);
      filter.frequency.exponentialRampToValueAtTime(1800, t + 0.5);
      gain.gain.setValueAtTime(0.001, t);
      gain.gain.exponentialRampToValueAtTime(0.7, t + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.9);
      src.connect(filter);
      filter.connect(gain);
      gain.connect(master);
      src.start(t);
      src.stop(t + 0.95);
      playTone('square', 523.3, 1046.5, 0, 0.6, 0.12);
      playTone('square', 659.3, 1318.5, 0, 0.6, 0.1);
      playTone('square', 784.0, 1568.0, 0, 0.6, 0.1);
    }
  };
})();
