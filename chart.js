// Chart: BPM, 차트, 판정 창 값
// 담당: Builder A uoona-svg — 이 파일은 담당자만 수정한다. 인터페이스는 SPEC.md 5장.

var Chart = {
  bpm: 120,
  totalBeats: 64,
  countInBeats: 4,
  // 평소 입력 박 번호 (23개)
  normal: [
    8, 10, 12, 14, 16, 18, 20,
    26, 28, 30, 32, 34, 36, 38, 40, 42, 44,
    50, 52, 54, 56, 58, 60
  ],
  // 함성: beat에 누르고, prepBeat부터 준비 자세
  cheers: [
    { beat: 24, prepBeat: 22 },
    { beat: 48, prepBeat: 46 }
  ],
  // 정해진 박 시각과의 차이 기준 (ms)
  judgeWindow: { perfect: 70, good: 140 }
};
