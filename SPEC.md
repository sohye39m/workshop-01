# K-POP 응원봉 리듬 게임 SPEC

아이돌 무대를 보며 객석 팬들과 박자를 맞춰 응원봉을 흔들고, 신호가 오면 함성을 넣는 브라우저 리듬 게임.
구조는 "객석 맨 앞줄에서 NPC들과 박자를 맞춘다"는 리듬 게임 장르의 흔한 형식을 따르되, 캐릭터·그림·음악은 전부 오리지널(단순 도형 + WebAudio 생성음)로 만든다.

- 팀: Leader `sohye39m` / Builder `uoona-svg`, `inayun059-afk`, `MinjooSong0708`
- 제한 시간: 140분
- 기술: 순수 HTML/CSS/JS, 빌드 도구 없음, `index.html`을 브라우저로 열면 바로 동작

---

## 1. 게임 규칙

### 한 판의 구성
- BPM 120, 박 길이 0.5초, 총 64박(약 32초). 박 0~3은 카운트인, 4~63이 본 구간이다.
- 곡은 1개. WebAudio로 만든 박자음과 짧은 멜로디만 쓴다. 음원 파일은 쓰지 않는다.

### 화면 구성
| 영역 | 내용 |
|---|---|
| 위쪽 | 콘서트 무대와 아이돌 1명(도형) |
| 아래쪽 | 객석 맨 앞줄 팬 3명의 뒷모습. 왼쪽 NPC, 가운데 플레이어, 오른쪽 NPC |
| 맨 아래 | 자막 박스. 아이돌 대사를 띄운다 |
| 한쪽 모서리 | 점수와 콤보 표시 |

### 조작
스페이스바 하나만 쓴다.

### 평소 구간
- NPC 2명은 매 박 완벽한 박자로 응원봉을 흔든다.
- 플레이어는 차트에 정해진 박(`chart.js`의 `normal` 목록)에만 스페이스를 누른다. 기본은 2박마다 한 번.
- 정해진 박이 아닐 때 누른 입력은 감점한다(헛박수 감점). 점수 −30(0점 아래로는 내려가지 않음), 콤보 0으로 초기화.
- 눌러 놓고 있어서 생기는 키 반복 입력은 헛박수로 세지 않는다.

### 함성 구간
- 곡 중간에 2번 나온다. 박 24와 박 48에 스페이스를 누르면 함성이다.
- 별도의 자막이나 효과음 신호는 없다. 정해진 박의 **2박 전**에 NPC 2명이 응원봉을 머리 위로 들어 올려 흔들 준비 자세를 취한다. 이것이 신호다.
- 이때 플레이어도 **자동으로** 같은 준비 자세를 취한다(입력 없음).
- 준비 자세 중에는 평소 박이 없다. 이 구간에 누르면 헛박수라 감점한다.
- 정해진 박에 스페이스를 한 번 누르면 흔들기와 함성이 한 동작으로 나간다. 누르고 있을 필요는 없다.
- 함성 성공은 일반 입력의 2배 점수다.

### 판정
| 판정 | 기준(정해진 박 시각과의 차이) | 기본 점수 |
|---|---|---|
| Perfect | ±70ms 이내 | 100 |
| Good | ±140ms 이내 | 50 |
| Miss | 그 외, 또는 Good 범위가 끝날 때까지 입력 없음 | 0 |

- 콤보: Perfect, Good이면 +1, Miss이거나 헛박수이면 0으로 초기화.
- 콤보 보너스: 점수 배율 = `1.0 + 0.1 × floor(콤보 / 5)`, 최대 1.5배.
- 정해진 입력은 총 25개다(평소 23개 + 함성 2개).

### 차트 (박 번호 기준)
- 평소 입력: 8, 10, 12, 14, 16, 18, 20 / 26, 28, 30, 32, 34, 36, 38, 40, 42, 44 / 50, 52, 54, 56, 58, 60
- 함성: 24(준비 22부터), 48(준비 46부터)
- 곡 끝: 박 64

### 등급
정확도 = 실제 점수 ÷ 전부 Perfect일 때의 최대 점수

| 등급 | 정확도 |
|---|---|
| S | 90% 이상 |
| A | 75% 이상 |
| B | 55% 이상 |
| C | 55% 미만 |

### 연출
- 판정 글자(Perfect, Good, Miss)를 플레이어 머리 위에 잠깐 띄운다.
- Perfect이면 응원봉 불빛이 커진다. Miss이면 응원봉이 아래로 처진다.
- 아이돌 표정(도형)과 자막 문구는 진행 상황에 따라 바뀐다. 자막은 분위기용이고 신호 역할은 하지 않는다.

---

## 2. 화면 흐름

```
[시작 화면] --스페이스/버튼--> [카운트인 4박] --> [진행 약 28초] --> [결과 화면]
     ^                                                                   |
     +----------------------- 다시 하기 ---------------------------------+
```

1. **시작 화면**: 제목, 조작 설명(스페이스바, 준비 자세가 보이면 함성), 시작 버튼. 브라우저 오디오 정책 때문에 반드시 이 화면의 사용자 입력으로 오디오를 깨운다.
2. **카운트인**: 박 0~3 동안 박자음과 NPC만 흔들고, 자막에 "준비~" 같은 문구를 띄운다.
3. **진행**: 차트에 따라 평소 입력과 함성이 이어진다. 점수와 콤보를 실시간으로 표시한다.
4. **결과 화면**: 등급, 총점, 최고 콤보, Perfect/Good/Miss 개수, 아이돌의 등급별 한마디, "다시 하기" 버튼.

---

## 3. 이번에 만들지 않을 것
- 곡 선택, 여러 곡, 난이도 선택
- 캐릭터·응원봉 커스터마이징
- 랭킹, 서버, 로그인, 최고 기록 저장(localStorage 포함)
- 모바일·터치 입력, 멀티터치
- 마우스 조작, 방향키 조작
- 음원 파일, 이미지 파일 등 외부 에셋(전부 코드로 그림)
- 일시정지, 설정 화면, 지연 보정(캘리브레이션) 화면
- 대전·멀티플레이

---

## 4. 역할과 파일 분담
한 파일에는 주인이 한 명만 있다. 남의 파일은 직접 고치지 않고 이슈나 PR 리뷰로 요청한다.
Builder A, B, C는 이 문서에 적힌 순서대로 배정한 것이다. 바꾸려면 Leader에게 말한다.

| 담당 | 영역 | 파일 |
|---|---|---|
| Leader `sohye39m` | SPEC, 이슈 관리, 통합, 리뷰, 최종 데모 | `SPEC.md`, `README.md` |
| Builder A `uoona-svg` | 리듬·오디오 | `chart.js`, `audio.js`, `rhythm.js` |
| Builder B `inayun059-afk` | 화면·캐릭터 | `stage.js`, `characters.js` |
| Builder C `MinjooSong0708` | UI·흐름 | `index.html`, `style.css`, `ui.js`, `script.js`, `main.js` |

- `index.html`의 `<script>` 순서는 C가 관리한다: `chart.js`, `audio.js`, `rhythm.js`, `characters.js`, `stage.js`, `script.js`, `ui.js`, `main.js`
- 파일은 빈 stub(전역 이름만 선언)으로 Leader가 처음에 한 번 만들고, 이후에는 각 주인만 수정한다.
- 모든 코드는 ES 모듈이 아니라 일반 스크립트로, 전역 객체 하나씩(`Chart`, `GameAudio`, `Rhythm`, `Stage`, `Characters`, `Script`, `UI`)을 둔다. `file://`로 열어도 동작하게 하기 위해서다.

---

## 5. 서로를 부르는 이름 (인터페이스)
아래 이름은 약속이다. 바꿔야 하면 먼저 Leader에게 말하고 SPEC.md를 고친 뒤에 바꾼다.

### `Chart` (chart.js, A)
- `Chart.bpm` = 120
- `Chart.totalBeats` = 64
- `Chart.countInBeats` = 4
- `Chart.normal` = 평소 입력 박 번호 배열
- `Chart.cheers` = `[{ beat: 24, prepBeat: 22 }, { beat: 48, prepBeat: 46 }]`
- `Chart.judgeWindow` = `{ perfect: 70, good: 140 }` (ms)

### `GameAudio` (audio.js, A)
- `GameAudio.unlock()` : 사용자 입력 직후 호출해 AudioContext를 깨운다
- `GameAudio.now()` : 오디오 시계 기준 현재 시각(초)
- `GameAudio.startSong(startTime)` : 곡 시작. 박자음과 멜로디를 예약한다
- `GameAudio.stopSong()`
- `GameAudio.playHit(result)` : `'perfect' | 'good' | 'miss'`에 맞는 짧은 효과음
- `GameAudio.playCheer()` : 함성 효과음

### `Rhythm` (rhythm.js, A)
- `Rhythm.start()` : 카운트인부터 한 판 시작
- `Rhythm.stop()`
- `Rhythm.press()` : 스페이스 입력이 들어올 때 호출
- `Rhythm.on(eventName, handler)` : 이벤트 구독
- `Rhythm.getState()` : `{ phase, beat, score, combo }` (`phase`는 `'idle' | 'countin' | 'playing' | 'ended'`)

`Rhythm`이 내보내는 이벤트와 전달값:

| 이벤트 | 값 | 의미 |
|---|---|---|
| `beat` | `{ beat }` | 매 박마다 |
| `cueStart` | `{ beat, targetBeat }` | 함성 준비 시작(2박 전). 플레이어와 NPC가 준비 자세를 취한다 |
| `judge` | `{ result, kind, combo, score }` | `result`는 `'perfect' / 'good' / 'miss'`, `kind`는 `'normal' / 'cheer' / 'stray'`. 헛박수는 `kind: 'stray'`, `result: 'miss'`로 보내고 점수는 −30 반영 |
| `end` | `{ score, maxCombo, counts, grade }` | `counts`는 `{ perfect, good, miss }`, `grade`는 `'S' / 'A' / 'B' / 'C'` |

### `Characters` (characters.js, B)
- `Characters.drawIdol(ctx, mood)` : `mood`는 `'idle' | 'happy' | 'cheer'`
- `Characters.drawFan(ctx, x, y, pose, glow)` : `pose`는 `'idle' | 'swing' | 'ready' | 'cheer' | 'droop'`

### `Stage` (stage.js, B)
- `Stage.init(canvas)` : 캔버스를 받아 그리기 루프를 시작한다
- `Stage.reset()`
- `Stage.onBeat(beat)` : NPC가 매 박 흔들게 한다
- `Stage.setPose(who, pose)` : `who`는 `'player' | 'npcLeft' | 'npcRight'`
- `Stage.setIdolMood(mood)`
- `Stage.showJudge(result)` : 플레이어 머리 위 판정 글자

### `Script` (script.js, C)
- `Script.lines` = `[{ beat, text }]` 아이돌 대사 목록
- `Script.resultLine(grade)` : 등급별 아이돌 한마디

### `UI` (ui.js, C)
- `UI.showScreen(name)` : `'start' | 'play' | 'result'`
- `UI.setSubtitle(text)`
- `UI.updateHud({ score, combo })`
- `UI.showResult({ score, maxCombo, counts, grade })`
- `UI.onStart(handler)` / `UI.onRetry(handler)`

### 연결은 `main.js`(C)만 한다
- 스페이스 keydown → `Rhythm.press()` (눌러 놓고 있는 반복 입력은 무시)
- `beat` → `Stage.onBeat`, 해당 박의 `Script.lines` → `UI.setSubtitle`
- `cueStart` → `Stage.setPose('player' | 'npcLeft' | 'npcRight', 'ready')`
- `judge` → `GameAudio.playHit`, `Stage.setPose`(성공이면 `'swing'` 또는 `'cheer'`, miss면 `'droop'`), `Stage.showJudge`, `UI.updateHud`
- `end` → `UI.showResult`, `UI.showScreen('result')`

---

## 6. 140분 일정

| 시간 | 할 일 |
|---|---|
| 0~15분 | SPEC 확정, 이슈 생성, stub 커밋 (Leader) |
| 15~75분 | Builder 3명이 각자 파일 구현 (병렬) |
| 75~105분 | 통합: `main.js` 연결, 전체 플레이, 판정 시각 조정 |
| 105~130분 | 연출 다듬기, 버그 수정 |
| 130~140분 | 데모 리허설 |

범위가 밀리면 이 순서로 줄인다: 결과 화면의 아이돌 한마디 → 아이돌 표정 변화 → 판정 글자 연출.

---

## 7. 이슈 목록 (먼저 할 것부터)

| # | 작업 | 담당 | 비고 |
|---|---|---|---|
| 1 | 폴더 구조, README, 파일별 빈 stub, `index.html` 스크립트 순서 확정 | Leader | 다른 이슈의 시작 조건 |
| 2 | `chart.js` : BPM, 차트(평소 입력, 함성), 판정 창 값 | A | 작아서 가장 먼저 끝내고 `rhythm.js` 진행 |
| 3 | `audio.js` : AudioContext 깨우기, 박자음, 짧은 멜로디, 판정·함성 효과음 | A | |
| 4 | `rhythm.js` : 오디오 시계 기준 박 타이머, 판정, 점수·콤보, 이벤트 발행, 등급 계산 | A | #2 필요 |
| 5 | `characters.js` : 아이돌, 팬의 뒷모습, 응원봉 포즈(idle/swing/ready/cheer/droop)를 도형으로 그리기 | B | |
| 6 | `stage.js` : 무대 배경, 조명, 팬 3명 배치, NPC 매 박 흔들기, 판정 글자 | B | #5 필요 |
| 7 | `index.html`, `style.css`, `ui.js` : 시작·진행·결과 화면, 자막 박스, 점수·콤보 표시 | C | |
| 8 | `script.js` : 아이돌 대사(박 번호별)와 등급별 한마디 | C | |
| 9 | `main.js` : 키 입력과 이벤트 연결 | C | #4, #6, #7 인터페이스 필요 |
| 10 | 통합 플레이 테스트, 판정 시각 조정, 이슈 정리 | Leader + 전원 | 75분 지점 |
| 11 | 버그 수정과 연출 다듬기 | 각자 자기 파일 | |
| 12 | 데모 리허설, README 마무리 | Leader | |
