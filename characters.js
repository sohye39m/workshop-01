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
  var passes = [['#c0609a', 6.5], ['#f08cc4', 5], ['#ffd0ea', 1.8]];
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
  var i;

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

  // 다리와 신발
  for (i = -1; i <= 1; i += 2) {
    var leg = ctx.createLinearGradient(i * 5 - 3, 0, i * 5 + 3, 0);
    leg.addColorStop(0, '#f0c4a4');
    leg.addColorStop(0.5, '#ffe0c8');
    leg.addColorStop(1, '#d9a07c');
    ctx.fillStyle = leg;
    ctx.fillRect(i * 5 - 2.5, -12, 5, 11);
    ctx.fillStyle = '#e8e8f4';
    ctx.beginPath();
    ctx.ellipse(i * 5, -1, 4.5, 2.4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ff7cc4';
    ctx.fillRect(i * 5 - 3.5, -4.5, 7, 1.6);
  }

  // 치마: 허리에서 퍼지는 A라인. 주름마다 명암이 다르다.
  var skirt = ctx.createLinearGradient(-22, 0, 22, 0);
  skirt.addColorStop(0, '#8a5fc4');
  skirt.addColorStop(0.2, '#6a43a8');
  skirt.addColorStop(0.5, '#5a3a98');
  skirt.addColorStop(0.8, '#6a43a8');
  skirt.addColorStop(1, '#8a5fc4');
  ctx.fillStyle = skirt;
  ctx.beginPath();
  ctx.moveTo(-9, -29);
  ctx.quadraticCurveTo(-14, -18, -23, -9);
  ctx.quadraticCurveTo(0, -4, 23, -9);
  ctx.quadraticCurveTo(14, -18, 9, -29);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = 'rgba(25, 10, 60, 0.35)';
  ctx.lineWidth = 1.2;
  for (i = -3; i <= 3; i++) {
    ctx.beginPath();
    ctx.moveTo(i * 2.6, -28);
    ctx.quadraticCurveTo(i * 4.5, -18, i * 7.2, -7);
    ctx.stroke();
  }
  // 치마 끝단 흰 선
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(-23, -9);
  ctx.quadraticCurveTo(0, -4, 23, -9);
  ctx.stroke();

  // 상의: 좁은 어깨, 잘록한 허리. 가장자리에 림라이트.
  var top = ctx.createLinearGradient(-13, 0, 13, 0);
  top.addColorStop(0, '#ffc6e6');
  top.addColorStop(0.2, '#f08cc4');
  top.addColorStop(0.8, '#e070b0');
  top.addColorStop(1, '#ffc0e2');
  ctx.fillStyle = top;
  ctx.beginPath();
  ctx.moveTo(-9, -28);
  ctx.quadraticCurveTo(-8, -36, -13, -43);
  ctx.quadraticCurveTo(0, -50, 13, -43);
  ctx.quadraticCurveTo(8, -36, 9, -28);
  ctx.closePath();
  ctx.fill();
  var shade = ctx.createLinearGradient(0, -50, 0, -26);
  shade.addColorStop(0, 'rgba(255, 255, 255, 0.18)');
  shade.addColorStop(1, 'rgba(60, 0, 40, 0.25)');
  ctx.fillStyle = shade;
  ctx.fill();

  // 허리 리본 벨트
  ctx.fillStyle = '#fff2fa';
  ctx.fillRect(-9.5, -30, 19, 3);
  ctx.beginPath();
  ctx.moveTo(0, -28.5);
  ctx.lineTo(-6, -33);
  ctx.lineTo(-6, -24);
  ctx.closePath();
  ctx.moveTo(0, -28.5);
  ctx.lineTo(6, -33);
  ctx.lineTo(6, -24);
  ctx.closePath();
  ctx.fillStyle = '#ffd0ea';
  ctx.fill();

  // 머리: 구 모양 + 허리까지 내려오는 긴 머리
  var hairShape = function () {
    ctx.beginPath();
    ctx.arc(0, -62, 12.5, Math.PI, Math.PI * 2);
    ctx.bezierCurveTo(15, -52, 15, -40, 12, -31);
    ctx.quadraticCurveTo(6, -26, 0, -30);
    ctx.quadraticCurveTo(-6, -26, -12, -31);
    ctx.bezierCurveTo(-15, -40, -15, -52, -12.5, -62);
    ctx.closePath();
  };
  var hair = ctx.createLinearGradient(-14, -70, 14, -30);
  hair.addColorStop(0, '#7a5a9e');
  hair.addColorStop(0.35, '#3e2a5c');
  hair.addColorStop(1, '#241636');
  ctx.fillStyle = hair;
  hairShape();
  ctx.fill();
  var hairShade = ctx.createRadialGradient(-5, -68, 1, 0, -62, 16);
  hairShade.addColorStop(0, 'rgba(255, 255, 255, 0.28)');
  hairShade.addColorStop(1, 'rgba(0, 0, 0, 0.2)');
  ctx.fillStyle = hairShade;
  hairShape();
  ctx.fill();

  // 머리결(세로 결)과 윤기
  ctx.lineCap = 'round';
  ctx.strokeStyle = 'rgba(20, 8, 40, 0.35)';
  ctx.lineWidth = 1;
  for (i = -2; i <= 2; i++) {
    ctx.beginPath();
    ctx.moveTo(i * 4, -56);
    ctx.quadraticCurveTo(i * 5.5, -44, i * 4.2, -32);
    ctx.stroke();
  }
  ctx.strokeStyle = 'rgba(225, 205, 255, 0.6)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, -62, 9.5, Math.PI * 1.12, Math.PI * 1.6);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-7, -50);
  ctx.quadraticCurveTo(-9, -42, -8, -36);
  ctx.stroke();

  // 큰 리본 머리핀(머리 한쪽에)
  var ribbon = ctx.createLinearGradient(0, -78, 0, -68);
  ribbon.addColorStop(0, '#ff9ad6');
  ribbon.addColorStop(1, '#ff4fa8');
  ctx.fillStyle = ribbon;
  ctx.beginPath();
  ctx.moveTo(6, -72);
  ctx.quadraticCurveTo(0, -81, -2, -73);
  ctx.quadraticCurveTo(0, -66, 6, -72);
  ctx.moveTo(6, -72);
  ctx.quadraticCurveTo(12, -81, 14, -73);
  ctx.quadraticCurveTo(12, -66, 6, -72);
  ctx.fill();
  ctx.fillStyle = '#ffe3f4';
  ctx.beginPath();
  ctx.arc(6, -72, 2.3, 0, Math.PI * 2);
  ctx.fill();

  // 팔과 응원봉. 몸 뒤쪽 팔 → 몸 앞쪽 팔 순서로 겹친다.
  var shoulderY = -43;
  var handX = p.hx;
  var handY = shoulderY + p.hy;
  if (pose === 'cheer') {
    Characters._drawArm(ctx, -10, shoulderY, -p.hx, handY, -1);
  }
  Characters._drawArm(ctx, 10, shoulderY, handX, handY, 1);
  Characters._drawLightstick(ctx, handX, handY, p.angle, g);

  ctx.restore();
};
