// Characters: 아이돌·팬 그리기
// 담당: Builder B inayun059-afk — 이 파일은 담당자만 수정한다. 인터페이스는 SPEC.md 5장.

var Characters = {};

// 포즈별 응원봉 자세. 어깨 기준 손 위치(hx, hy)와 봉의 각도(rad, 0이 위쪽, +는 오른쪽으로 기움)
Characters._fanPoses = {
  idle:  { hx: 20, hy: 4,   angle: 0.12 },
  swing: { hx: 26, hy: -8,  angle: 0.95 },
  ready: { hx: 15, hy: -30, angle: 0 },
  cheer: { hx: 17, hy: -34, angle: -0.2 },
  droop: { hx: 18, hy: 12,  angle: 2.85 }
};

// 팔 한쪽: 어깨 → 팔꿈치 → 손. 어두운 바깥선 위에 밝은 면을 겹쳐 둥근 느낌을 낸다.
Characters._drawArm = function (ctx, sx, sy, hx, hy, side) {
  var cx = (sx + hx) / 2 + side * 7;
  var cy = (sy + hy) / 2 + 5;
  var passes = [['#262a4d', 9], ['#3d4380', 7], ['#5a62a8', 2.5]];
  ctx.lineCap = 'round';
  for (var i = 0; i < passes.length; i++) {
    ctx.strokeStyle = passes[i][0];
    ctx.lineWidth = passes[i][1];
    ctx.beginPath();
    ctx.moveTo(sx + (i === 2 ? -side : 0), sy);
    ctx.quadraticCurveTo(cx, cy, hx, hy);
    ctx.stroke();
  }
  // 손
  var hand = ctx.createRadialGradient(hx - 1, hy - 1, 0.5, hx, hy, 5);
  hand.addColorStop(0, '#ffe3cc');
  hand.addColorStop(1, '#d9a07c');
  ctx.fillStyle = hand;
  ctx.beginPath();
  ctx.arc(hx, hy, 4.2, 0, Math.PI * 2);
  ctx.fill();
};

// 응원봉: 손 위치에서 angle 방향으로 뻗는다. 손잡이 + 유리 머리 + 번지는 빛.
Characters._drawLightstick = function (ctx, hx, hy, angle, g) {
  var headR = 6.5 * (0.85 + 0.35 * g);
  var haloR = 14 * g + 10;

  ctx.save();
  ctx.translate(hx, hy);
  ctx.rotate(angle);

  // 번지는 빛(밝은 색을 더해 겹치는 부분이 더 환해지게)
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  var halo = ctx.createRadialGradient(0, -30, 0, 0, -30, haloR * 1.6);
  halo.addColorStop(0, 'rgba(255, 110, 200, ' + Math.min(0.9, 0.45 + 0.25 * g) + ')');
  halo.addColorStop(0.5, 'rgba(255, 80, 190, 0.22)');
  halo.addColorStop(1, 'rgba(255, 80, 190, 0)');
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(0, -30, haloR * 1.6, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 손잡이(금속 느낌의 세로 그라데이션)
  var grip = ctx.createLinearGradient(-3, 0, 3, 0);
  grip.addColorStop(0, '#2b2b3a');
  grip.addColorStop(0.45, '#8a8aa8');
  grip.addColorStop(1, '#1d1d28');
  ctx.fillStyle = grip;
  ctx.beginPath();
  ctx.moveTo(-2.6, 3);
  ctx.lineTo(-2.2, -14);
  ctx.lineTo(2.2, -14);
  ctx.lineTo(2.6, 3);
  ctx.closePath();
  ctx.fill();

  // 이음 고리
  ctx.fillStyle = '#c9c9e0';
  ctx.fillRect(-4, -17, 8, 3);

  // 유리 머리(캡슐): 안쪽이 밝고 가장자리가 진한 구 느낌
  var cy = -17 - headR - 2;
  var glass = ctx.createRadialGradient(-headR * 0.25, cy - headR * 0.3, 1, 0, cy, headR * 1.5);
  glass.addColorStop(0, '#ffffff');
  glass.addColorStop(0.3, '#ffb3e6');
  glass.addColorStop(0.75, '#ff4fb0');
  glass.addColorStop(1, '#b0136f');
  ctx.fillStyle = glass;
  ctx.beginPath();
  ctx.arc(0, cy, headR, 0, Math.PI * 2);
  ctx.fill();

  // 유리 반사광
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.beginPath();
  ctx.ellipse(-headR * 0.35, cy - headR * 0.4, headR * 0.28, headR * 0.17, -0.6, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
};

// 팬 뒷모습 하나를 그린다. (x, y)는 발치 중앙, glow는 불빛 크기 배율(기본 1)
Characters.drawFan = function (ctx, x, y, pose, glow) {
  var p = Characters._fanPoses[pose] || Characters._fanPoses.idle;
  var g = typeof glow === 'number' ? glow : 1;

  ctx.save();
  ctx.translate(x, y);

  // 바닥 그림자
  var shadow = ctx.createRadialGradient(0, 2, 2, 0, 2, 26);
  shadow.addColorStop(0, 'rgba(0, 0, 0, 0.45)');
  shadow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = shadow;
  ctx.beginPath();
  ctx.ellipse(0, 2, 26, 7, 0, 0, Math.PI * 2);
  ctx.fill();

  // 몸통: 가장자리에 림라이트가 들어가는 가로 그라데이션
  var body = ctx.createLinearGradient(-19, 0, 19, 0);
  body.addColorStop(0, '#5a62a8');
  body.addColorStop(0.18, '#3a3f78');
  body.addColorStop(0.8, '#2a2e58');
  body.addColorStop(1, '#4b52a0');
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.moveTo(-19, 0);
  ctx.quadraticCurveTo(-18, -26, -15, -42);
  ctx.quadraticCurveTo(0, -52, 15, -42);
  ctx.quadraticCurveTo(18, -26, 19, 0);
  ctx.closePath();
  ctx.fill();

  // 등 가운데 접힌 주름(후드 느낌)과 아래쪽으로 어두워지는 명암
  ctx.strokeStyle = 'rgba(15, 15, 40, 0.35)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, -44);
  ctx.quadraticCurveTo(2, -24, 0, -2);
  ctx.stroke();
  var fade = ctx.createLinearGradient(0, -50, 0, 0);
  fade.addColorStop(0, 'rgba(255, 255, 255, 0.12)');
  fade.addColorStop(1, 'rgba(0, 0, 0, 0.28)');
  ctx.fillStyle = fade;
  ctx.beginPath();
  ctx.moveTo(-19, 0);
  ctx.quadraticCurveTo(-18, -26, -15, -42);
  ctx.quadraticCurveTo(0, -52, 15, -42);
  ctx.quadraticCurveTo(18, -26, 19, 0);
  ctx.closePath();
  ctx.fill();

  // 목
  ctx.fillStyle = '#c98f6c';
  ctx.fillRect(-4, -52, 8, 6);

  // 머리: 뒷머리가 보이는 구. 왼쪽 위에서 빛이 오는 명암
  var hair = ctx.createRadialGradient(-4, -66, 1, 0, -62, 14);
  hair.addColorStop(0, '#5a4778');
  hair.addColorStop(0.55, '#2f2444');
  hair.addColorStop(1, '#17101f');
  ctx.fillStyle = hair;
  ctx.beginPath();
  ctx.arc(0, -62, 12, 0, Math.PI * 2);
  ctx.fill();

  // 귀
  ctx.fillStyle = '#e8b896';
  ctx.beginPath();
  ctx.ellipse(-12, -60, 2, 3.2, 0, 0, Math.PI * 2);
  ctx.ellipse(12, -60, 2, 3.2, 0, 0, Math.PI * 2);
  ctx.fill();

  // 머리카락 윤기
  ctx.strokeStyle = 'rgba(210, 190, 255, 0.55)';
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(0, -62, 9, Math.PI * 1.15, Math.PI * 1.6);
  ctx.stroke();

  // 리본 머리끈
  ctx.fillStyle = '#ff5fb8';
  ctx.beginPath();
  ctx.moveTo(0, -73);
  ctx.lineTo(-6, -77);
  ctx.lineTo(-6, -69);
  ctx.closePath();
  ctx.moveTo(0, -73);
  ctx.lineTo(6, -77);
  ctx.lineTo(6, -69);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#ffd3ee';
  ctx.beginPath();
  ctx.arc(0, -73, 2, 0, Math.PI * 2);
  ctx.fill();

  // 팔과 응원봉. 몸 뒤쪽 팔 → 몸 앞쪽 팔 순서로 겹친다.
  var shoulderY = -42;
  var handX = p.hx;
  var handY = shoulderY + p.hy;
  if (pose === 'cheer') {
    Characters._drawArm(ctx, -12, shoulderY, -p.hx, handY, -1);
  }
  Characters._drawArm(ctx, 12, shoulderY, handX, handY, 1);
  Characters._drawLightstick(ctx, handX, handY, p.angle, g);

  ctx.restore();
};
