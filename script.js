// Script: 아이돌 대사와 등급별 한마디
// 담당: Builder C MinjooSong0708 — 이 파일은 담당자만 수정한다. 인터페이스는 SPEC.md 5장.

// 자막은 분위기용이다. 함성 신호는 NPC의 준비 자세뿐이므로 신호가 되는 문구는 쓰지 않는다.
var Script = {
  lines: [
    { beat: 0, text: '준비~' },
    { beat: 2, text: '다들 와줬네요!' },
    { beat: 4, text: '자, 시작해 볼까요?' },
    { beat: 8, text: '좋아요, 그 박자예요!' },
    { beat: 12, text: '오늘 객석 분위기 최고예요!' },
    { beat: 16, text: '다 같이 하나가 되는 느낌!' },
    { beat: 20, text: '눈을 떼지 말아요~' },
    { beat: 24, text: '와, 소리 들었어요?' },
    { beat: 28, text: '여러분 덕분에 힘이 나요!' },
    { beat: 32, text: '이제 절반을 넘었어요!' },
    { beat: 36, text: '아직 쌩쌩하죠?' },
    { beat: 40, text: '계속 이 느낌으로 가요~' },
    { beat: 44, text: '조금만 더 힘내요!' },
    { beat: 48, text: '우리 완전 잘 맞아요!' },
    { beat: 52, text: '마지막이 다가와요~' },
    { beat: 56, text: '끝까지 같이 해요!' },
    { beat: 60, text: '다 왔어요, 마지막까지!' }
  ],

  resultLine: function (grade) {
    var lines = {
      S: '완벽해요! 오늘 무대의 주인공은 바로 당신이에요!',
      A: '정말 멋졌어요! 박자가 딱딱 맞았어요!',
      B: '좋았어요! 다음엔 더 잘 맞출 수 있을 거예요!',
      C: '함께해 줘서 고마워요! 한 번 더 해 볼까요?'
    };
    return lines[grade] || lines.C;
  }
};
