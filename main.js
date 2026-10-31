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
