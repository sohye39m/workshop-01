// Characters: 아이돌·팬 그리기
// 담당: Builder B inayun059-afk — 이 파일은 담당자만 수정한다. 인터페이스는 SPEC.md 5장.

var Characters = {};

// 굵은 외곽선 + 평평한 색 + 한 톤 그림자로 그리는 만화 스타일
Characters._OUTLINE = '#3a1f4d';
Characters._SKIN = '#ffd9c0';
Characters._SKIN_SHADE = '#f0b595';

// 포즈별 응원봉 자세. 어깨 기준 손 위치(hx, hy)와 봉의 각도(rad, 0이 위쪽, +는 오른쪽으로 기움)
Characters._fanPoses = {
  idle:  { hx: 22, hy: 4,   angle: 0.12 },
  swing: { hx: 28, hy: -8,  angle: 0.95 },
  ready: { hx: 17, hy: -30, angle: 0 },
  cheer: { hx: 19, hy: -34, angle: -0.2 },
  droop: { hx: 20, hy: 12,  angle: 2.85 }
};

// 도형 하나를 색으로 채우고, 오른쪽 아래에 한 톤 어두운 그림자를 깔고, 외곽선을 두른다.
Characters._cel = function (ctx, pathFn, color, shade, lineWidth) {
  pathFn();
  ctx.fillStyle = color;
  ctx.fill();
  if (shade) {
    ctx.save();
    pathFn();
    ctx.clip();
    ctx.fillStyle = shade;
    ctx.beginPath();
    ctx.moveTo(3, -120);
    ctx.lineTo(60, -120);
    ctx.lineTo(60, 20);
    ctx.lineTo(-4, 20);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
  pathFn();
  ctx.strokeStyle = Characters._OUTLINE;
  ctx.lineWidth = lineWidth || 2.2;
  ctx.lineJoin = 'round';
  ctx.stroke();
};

// 팔 한쪽: 어깨 → 팔꿈치 → 손목. 팔꿈치는 몸 바깥·아래쪽으로 꺾는다.
Characters._drawArm = function (ctx, sx, sy, hx, hy, side, sleeve, sleeveHi) {
  sleeve = sleeve || '#ff8ac8';
  sleeveHi = sleeveHi || '#ffc2e4';
  var dx = hx - sx;
  var dy = hy - sy;
  var d = Math.sqrt(dx * dx + dy * dy) || 1;
  var L = Math.max(14, d * 0.51 + 0.5);
  var h = Math.sqrt(Math.max(0, L * L - (d / 2) * (d / 2)));
  var nx = -dy / d;
  var ny = dx / d;
  if (side * nx * 0.6 + ny * 0.8 < 0) { nx = -nx; ny = -ny; }
  var ex = sx + dx / 2 + nx * h;
  var ey = sy + dy / 2 + ny * h;
  var sleeveX = sx + (ex - sx) * 0.7;
  var sleeveY = sy + (ey - sy) * 0.7;
  var line = function (x1, y1, x2, y2, x3, y3, color, w) {
    ctx.strokeStyle = color;
    ctx.lineWidth = w;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    if (x3 !== undefined) { ctx.lineTo(x3, y3); }
    ctx.stroke();
  };

  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // 맨살 팔: 외곽선 → 면 → 아랫면 그림자 줄
  line(sx, sy, ex, ey, hx, hy, Characters._OUTLINE, 9);
  line(sx, sy, ex, ey, hx, hy, Characters._SKIN, 5);
  line(ex - nx * 1.5, ey - ny * 1.5, hx - nx * 1.5, hy - ny * 1.5, undefined, undefined, Characters._SKIN_SHADE, 1.4);

  // 짧은 퍼프 소매
  line(sx, sy, sleeveX, sleeveY, undefined, undefined, Characters._OUTLINE, 12);
  line(sx, sy, sleeveX, sleeveY, undefined, undefined, sleeve, 8);
  line(sx - side * 1.6, sy - 1.6, sleeveX - side * 1.6, sleeveY - 1.6, undefined, undefined, sleeveHi, 2);
};

// 손(응원봉을 쥔 주먹). 머리카락 앞에 그려야 해서 팔과 따로 그린다.
Characters._drawHand = function (ctx, hx, hy) {
  Characters._cel(ctx, function () {
    ctx.beginPath();
    ctx.arc(hx, hy, 4.8, 0, Math.PI * 2);
  }, Characters._SKIN, null, 2);
  ctx.fillStyle = Characters._SKIN_SHADE;
  ctx.beginPath();
  ctx.arc(hx + 1.3, hy + 1.5, 2, 0, Math.PI * 2);
  ctx.fill();
};

// 응원봉: 손 위치에서 angle 방향으로 뻗는다. 손잡이 + 구슬 + 번지는 빛.
Characters._drawLightstick = function (ctx, hx, hy, angle, g) {
  var headR = 6.5 * (0.85 + 0.35 * g);
  var haloR = 14 * g + 10;
  var cy = -17 - headR - 1;

  ctx.save();
  ctx.translate(hx, hy);
  ctx.rotate(angle);

  // 번지는 빛(밝은 색을 더해 겹치는 부분이 더 환해지게)
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  var halo = ctx.createRadialGradient(0, cy, 0, 0, cy, haloR * 1.6);
  halo.addColorStop(0, 'rgba(255, 110, 200, ' + Math.min(0.85, 0.4 + 0.25 * g) + ')');
  halo.addColorStop(1, 'rgba(255, 80, 190, 0)');
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(0, cy, haloR * 1.6, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 손잡이
  Characters._cel(ctx, function () {
    ctx.beginPath();
    ctx.moveTo(-2.8, 4);
    ctx.lineTo(-2.4, -15);
    ctx.lineTo(2.4, -15);
    ctx.lineTo(2.8, 4);
    ctx.closePath();
  }, '#b9b9d6', '#8e8eb4', 1.8);

  // 이음 고리
  Characters._cel(ctx, function () {
    ctx.beginPath();
    ctx.rect(-4.5, -18, 9, 3.4);
  }, '#ffe27a', null, 1.8);

  // 구슬
  Characters._cel(ctx, function () {
    ctx.beginPath();
    ctx.arc(0, cy, headR, 0, Math.PI * 2);
  }, '#ff7cc4', null, 2.2);
  ctx.fillStyle = '#ff3fa4';
  ctx.beginPath();
  ctx.arc(headR * 0.25, cy + headR * 0.25, headR * 0.62, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.ellipse(-headR * 0.38, cy - headR * 0.42, headR * 0.3, headR * 0.2, -0.6, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
};

// 팬 뒷모습 하나를 그린다. (x, y)는 발치 중앙, glow는 불빛 크기 배율(기본 1)
Characters.drawFan = function (ctx, x, y, pose, glow) {
  var p = Characters._fanPoses[pose] || Characters._fanPoses.idle;
  var g = typeof glow === 'number' ? glow : 1;
  var cel = Characters._cel;
  var i;

  ctx.save();
  ctx.translate(x, y);

  // 바닥 그림자
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.beginPath();
  ctx.ellipse(0, 2, 24, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  // 다리와 신발
  for (i = -1; i <= 1; i += 2) {
    cel(ctx, function () {
      ctx.beginPath();
      ctx.rect(i * 5 - 2.6, -13, 5.2, 11);
    }, Characters._SKIN, null, 1.8);
    cel(ctx, function () {
      ctx.beginPath();
      ctx.ellipse(i * 5, -1.5, 5, 3, 0, 0, Math.PI * 2);
    }, '#ffffff', null, 1.8);
    ctx.fillStyle = '#ff7cc4';
    ctx.fillRect(i * 5 - 3.5, -5, 7, 1.8);
  }

  // 치마: 허리에서 퍼지는 A라인
  var skirtPath = function () {
    ctx.beginPath();
    ctx.moveTo(-9, -29);
    ctx.quadraticCurveTo(-14, -18, -23, -9);
    ctx.quadraticCurveTo(0, -3, 23, -9);
    ctx.quadraticCurveTo(14, -18, 9, -29);
    ctx.closePath();
  };
  cel(ctx, skirtPath, '#8a5fd6', '#6f47b8', 2.2);
  ctx.strokeStyle = '#5a35a0';
  ctx.lineWidth = 1.4;
  ctx.lineCap = 'round';
  for (i = -2; i <= 2; i++) {
    ctx.beginPath();
    ctx.moveTo(i * 3, -27);
    ctx.quadraticCurveTo(i * 5, -18, i * 7.5, -7);
    ctx.stroke();
  }
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-22, -9.5);
  ctx.quadraticCurveTo(0, -4, 22, -9.5);
  ctx.stroke();

  // 상의
  cel(ctx, function () {
    ctx.beginPath();
    ctx.moveTo(-9, -28);
    ctx.quadraticCurveTo(-8, -36, -14, -43);
    ctx.quadraticCurveTo(0, -50, 14, -43);
    ctx.quadraticCurveTo(8, -36, 9, -28);
    ctx.closePath();
  }, '#ff8ac8', '#e56bb0', 2.2);

  // 허리 리본 벨트
  cel(ctx, function () {
    ctx.beginPath();
    ctx.rect(-9.5, -31, 19, 3.6);
  }, '#fff2fa', null, 1.8);
  cel(ctx, function () {
    ctx.beginPath();
    ctx.moveTo(0, -29);
    ctx.lineTo(-6.5, -34);
    ctx.lineTo(-6.5, -24);
    ctx.closePath();
    ctx.moveTo(0, -29);
    ctx.lineTo(6.5, -34);
    ctx.lineTo(6.5, -24);
    ctx.closePath();
  }, '#ffb0dc', null, 1.8);

  // 팔은 긴 머리 뒤에서 나온다. 몸 뒤쪽 팔 → 앞쪽 팔 순서.
  var shoulderY = -43;
  var handX = p.hx;
  var handY = shoulderY + p.hy;
  if (pose === 'cheer') {
    Characters._drawArm(ctx, -13, shoulderY, -p.hx, handY, -1);
    Characters._drawHand(ctx, -p.hx, handY);
  }
  Characters._drawArm(ctx, 13, shoulderY, handX, handY, 1);

  // 머리: 구 + 허리까지 내려오는 긴 머리(어깨선 위로 팔이 보이도록 폭을 좁게)
  cel(ctx, function () {
    ctx.beginPath();
    ctx.arc(0, -62, 12.5, Math.PI, Math.PI * 2);
    ctx.bezierCurveTo(14, -52, 14, -42, 11.5, -33);
    ctx.quadraticCurveTo(6, -28, 0, -31);
    ctx.quadraticCurveTo(-6, -28, -11.5, -33);
    ctx.bezierCurveTo(-14, -42, -14, -52, -12.5, -62);
    ctx.closePath();
  }, '#5a3d8a', '#472f72', 2.4);

  // 머리결 줄과 윤기 띠
  ctx.lineCap = 'round';
  ctx.strokeStyle = '#3a2760';
  ctx.lineWidth = 1.2;
  for (i = -2; i <= 2; i += 2) {
    ctx.beginPath();
    ctx.moveTo(i * 4, -50);
    ctx.quadraticCurveTo(i * 5, -42, i * 4, -34);
    ctx.stroke();
  }
  ctx.strokeStyle = '#a98be0';
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.arc(0, -62, 9, Math.PI * 1.12, Math.PI * 1.62);
  ctx.stroke();

  // 큰 리본 머리핀
  cel(ctx, function () {
    ctx.beginPath();
    ctx.moveTo(6, -72);
    ctx.quadraticCurveTo(0, -82, -3, -73);
    ctx.quadraticCurveTo(0, -65, 6, -72);
    ctx.moveTo(6, -72);
    ctx.quadraticCurveTo(12, -82, 15, -73);
    ctx.quadraticCurveTo(12, -65, 6, -72);
  }, '#ff5fb8', null, 2);
  cel(ctx, function () {
    ctx.beginPath();
    ctx.arc(6, -72, 2.4, 0, Math.PI * 2);
  }, '#ffe3f4', null, 1.6);

  // 손과 응원봉은 머리카락 앞에 그린다.
  Characters._drawHand(ctx, handX, handY);
  Characters._drawLightstick(ctx, handX, handY, p.angle, g);

  ctx.restore();
};

// 별 모양 경로(중심 cx, cy, 바깥 반지름 r)
Characters._starPath = function (ctx, cx, cy, r) {
  ctx.beginPath();
  for (var k = 0; k < 10; k++) {
    var rad = k % 2 === 0 ? r : r * 0.45;
    var a = -Math.PI / 2 + k * Math.PI / 5;
    ctx.lineTo(cx + Math.cos(a) * rad, cy + Math.sin(a) * rad);
  }
  ctx.closePath();
};

// 무대 위 아이돌 한 명(정면). (0, 0)이 발치 중앙이고 키는 약 120이라, 부르는 쪽이 translate/scale로 자리를 잡는다.
// mood: 'idle'(차분한 미소) | 'happy'(눈웃음, 한 손 흔들기) | 'cheer'(두 팔 번쩍, 입 크게)
Characters.drawIdol = function (ctx, mood) {
  var cel = Characters._cel;
  var OUT = Characters._OUTLINE;
  var HAIR = '#6ec6ff';
  var HAIR_SHADE = '#4aa3e0';
  var JACKET = '#4f7df0';
  var JACKET_SHADE = '#3a62cc';
  var headY = -86;
  var i;
  var s;

  ctx.save();

  // 바닥 그림자
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.beginPath();
  ctx.ellipse(0, 2, 30, 7, 0, 0, Math.PI * 2);
  ctx.fill();

  // 바지와 부츠
  for (s = -1; s <= 1; s += 2) {
    cel(ctx, function () {
      ctx.beginPath();
      ctx.moveTo(s * 1, -40);
      ctx.lineTo(s * 13, -40);
      ctx.lineTo(s * 12, -8);
      ctx.lineTo(s * 2, -8);
      ctx.closePath();
    }, '#f4f0ff', '#d9d0f0', 2.2);
    cel(ctx, function () {
      ctx.beginPath();
      ctx.moveTo(s * 1.5, -9);
      ctx.lineTo(s * 12.5, -9);
      ctx.lineTo(s * 15, 0);
      ctx.lineTo(s * 0.5, 0);
      ctx.closePath();
    }, '#2b2b5a', null, 2.2);
  }

  // 재킷(어깨는 넓게, 허리는 좁게)
  cel(ctx, function () {
    ctx.beginPath();
    ctx.moveTo(-12, -38);
    ctx.quadraticCurveTo(-12, -50, -17, -64);
    ctx.quadraticCurveTo(0, -71, 17, -64);
    ctx.quadraticCurveTo(12, -50, 12, -38);
    ctx.closePath();
  }, JACKET, JACKET_SHADE, 2.4);
  // 재킷 앞 트임과 금색 벨트
  ctx.strokeStyle = OUT;
  ctx.lineWidth = 1.6;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(0, -67);
  ctx.lineTo(0, -39);
  ctx.stroke();
  cel(ctx, function () {
    ctx.beginPath();
    ctx.rect(-12.5, -42, 25, 4.5);
  }, '#ffe27a', null, 1.8);
  Characters._starPath(ctx, 6, -54, 5.5);
  ctx.fillStyle = '#ffe27a';
  ctx.fill();
  ctx.lineWidth = 1.4;
  ctx.lineJoin = 'round';
  ctx.stroke();

  // 팔: idle은 몸 옆, happy는 한 손 흔들기, cheer는 두 팔 번쩍
  var shoulderY = -62;
  var armR = { x: 29, y: -46 };
  var armL = { x: -29, y: -46 };
  if (mood === 'happy') {
    armR = { x: 31, y: -90 };
  } else if (mood === 'cheer') {
    armR = { x: 32, y: -108 };
    armL = { x: -32, y: -108 };
  }
  Characters._drawArm(ctx, -15, shoulderY, armL.x, armL.y, -1, JACKET, '#8fb0ff');
  Characters._drawArm(ctx, 15, shoulderY, armR.x, armR.y, 1, JACKET, '#8fb0ff');
  Characters._drawHand(ctx, armL.x, armL.y);
  Characters._drawHand(ctx, armR.x, armR.y);

  // 귀와 얼굴
  for (s = -1; s <= 1; s += 2) {
    cel(ctx, function () {
      ctx.beginPath();
      ctx.arc(s * 21, headY + 2, 4, 0, Math.PI * 2);
    }, Characters._SKIN, null, 2);
  }
  cel(ctx, function () {
    ctx.beginPath();
    ctx.arc(0, headY, 21, 0, Math.PI * 2);
  }, Characters._SKIN, null, 2.4);

  // 짧고 뾰족한 머리와 앞머리
  cel(ctx, function () {
    ctx.beginPath();
    ctx.moveTo(-22, headY + 6);
    ctx.lineTo(-23, headY - 12);
    ctx.lineTo(-17, headY - 26);
    ctx.lineTo(-12, headY - 21);
    ctx.lineTo(-6, headY - 31);
    ctx.lineTo(0, headY - 23);
    ctx.lineTo(7, headY - 32);
    ctx.lineTo(12, headY - 22);
    ctx.lineTo(19, headY - 27);
    ctx.lineTo(23, headY - 12);
    ctx.lineTo(22, headY + 6);
    ctx.lineTo(18, headY - 7);
    ctx.lineTo(12, headY - 12);
    ctx.lineTo(6, headY - 7);
    ctx.lineTo(0, headY - 14);
    ctx.lineTo(-7, headY - 8);
    ctx.lineTo(-13, headY - 13);
    ctx.lineTo(-18, headY - 6);
    ctx.closePath();
  }, HAIR, HAIR_SHADE, 2.4);

  // 금색 별 귀걸이
  Characters._starPath(ctx, -22, headY + 11, 4);
  ctx.fillStyle = '#ffe27a';
  ctx.fill();
  ctx.strokeStyle = OUT;
  ctx.lineWidth = 1.2;
  ctx.stroke();

  // 옅은 볼 홍조
  ctx.fillStyle = 'rgba(255, 130, 150, 0.4)';
  for (s = -1; s <= 1; s += 2) {
    ctx.beginPath();
    ctx.ellipse(s * 13, headY + 9, 4, 2.4, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = OUT;
  if (mood === 'happy') {
    // 눈웃음 ^ ^ 과 크게 웃는 입, 올라간 눈썹
    ctx.lineWidth = 2.8;
    for (s = -1; s <= 1; s += 2) {
      ctx.beginPath();
      ctx.arc(s * 9, headY + 3, 4.6, Math.PI * 1.1, Math.PI * 1.9);
      ctx.stroke();
    }
    ctx.lineWidth = 2.6;
    for (s = -1; s <= 1; s += 2) {
      ctx.beginPath();
      ctx.moveTo(s * 5, headY - 9);
      ctx.lineTo(s * 13, headY - 11);
      ctx.stroke();
    }
    cel(ctx, function () {
      ctx.beginPath();
      ctx.moveTo(-6, headY + 9);
      ctx.quadraticCurveTo(0, headY + 21, 6, headY + 9);
      ctx.closePath();
    }, '#ff6f8f', null, 2);
  } else if (mood === 'cheer') {
    // 반짝이는 큰 눈, 치켜 올린 눈썹, 활짝 벌린 입
    ctx.lineWidth = 2.8;
    for (s = -1; s <= 1; s += 2) {
      ctx.beginPath();
      ctx.moveTo(s * 4, headY - 7);
      ctx.lineTo(s * 14, headY - 10);
      ctx.stroke();
      cel(ctx, function () {
        ctx.beginPath();
        ctx.ellipse(s * 9, headY + 1, 4.6, 5.8, 0, 0, Math.PI * 2);
      }, '#2c3a7a', null, 1.8);
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(s * 9 - 1.4, headY - 1.4, 1.9, 0, Math.PI * 2);
      ctx.arc(s * 9 + 1.5, headY + 2.6, 1, 0, Math.PI * 2);
      ctx.fill();
    }
    cel(ctx, function () {
      ctx.beginPath();
      ctx.ellipse(0, headY + 12, 6.5, 6, 0, 0, Math.PI * 2);
    }, '#c9356a', null, 2);
    ctx.fillStyle = '#ff8fa8';
    ctx.beginPath();
    ctx.ellipse(0, headY + 15, 4, 2.4, 0, 0, Math.PI * 2);
    ctx.fill();
    // 머리 주변 반짝이
    var sparks = [[-36, headY - 24, 5], [38, headY - 20, 6], [0, headY - 42, 4.5]];
    for (i = 0; i < sparks.length; i++) {
      Characters._starPath(ctx, sparks[i][0], sparks[i][1], sparks[i][2]);
      ctx.fillStyle = '#ffe27a';
      ctx.fill();
      ctx.strokeStyle = OUT;
      ctx.lineWidth = 1.4;
      ctx.stroke();
    }
  } else {
    // idle: 또렷한 눈, 곧은 눈썹, 한쪽이 올라간 미소
    for (s = -1; s <= 1; s += 2) {
      cel(ctx, function () {
        ctx.beginPath();
        ctx.ellipse(s * 9, headY + 2, 3.4, 4.4, 0, 0, Math.PI * 2);
      }, '#2c3a7a', null, 1.8);
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(s * 9 - 1.1, headY, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.strokeStyle = OUT;
    ctx.lineWidth = 2.6;
    for (s = -1; s <= 1; s += 2) {
      ctx.beginPath();
      ctx.moveTo(s * 5, headY - 6);
      ctx.lineTo(s * 13, headY - 7);
      ctx.stroke();
    }
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(-5, headY + 13);
    ctx.quadraticCurveTo(0, headY + 15, 6, headY + 11);
    ctx.stroke();
  }

  ctx.restore();
};
