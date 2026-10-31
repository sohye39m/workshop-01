// main: 키 입력과 이벤트 연결
// 담당: Builder C MinjooSong0708 — 연결은 이 파일에서만 한다. SPEC.md 5장.

// 스페이스 keydown → Rhythm.press(). 눌러 놓고 있는 반복 입력은 무시한다.
document.addEventListener('keydown', function (e) {
  if (e.code !== 'Space') return;
  e.preventDefault();
  if (e.repeat) return;
  Rhythm.press();
});

// beat → NPC 흔들기, 해당 박의 대사를 자막으로
Rhythm.on('beat', function (e) {
  Stage.onBeat(e.beat);
  Script.lines.forEach(function (line) {
    if (line.beat === e.beat) UI.setSubtitle(line.text);
  });
});

// cueStart → 플레이어와 NPC 모두 준비 자세
Rhythm.on('cueStart', function () {
  ['player', 'npcLeft', 'npcRight'].forEach(function (who) {
    Stage.setPose(who, 'ready');
  });
});

// judge → 효과음, 플레이어 포즈, 판정 글자, 점수·콤보
Rhythm.on('judge', function (e) {
  GameAudio.playHit(e.result);
  if (e.result === 'miss') {
    Stage.setPose('player', 'droop');
  } else {
    Stage.setPose('player', e.kind === 'cheer' ? 'cheer' : 'swing');
  }
  Stage.showJudge(e.result);
  UI.updateHud({ score: e.score, combo: e.combo });
});

// end → 결과 화면
Rhythm.on('end', function (e) {
  UI.showResult(e);
  UI.showScreen('result');
});

// 시작·다시 하기 → 처음부터 한 판. 오디오는 이 버튼 입력 직후에 깨운다.
function startGame() {
  GameAudio.unlock();
  Stage.reset();
  UI.updateHud({ score: 0, combo: 0 });
  UI.setSubtitle('');
  UI.showScreen('play');
  Rhythm.start();
}

Stage.init(document.getElementById('stage-canvas'));
UI.onStart(startGame);
UI.onRetry(startGame);
