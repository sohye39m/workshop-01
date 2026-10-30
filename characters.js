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

// 팔 한쪽: 어깨 → 팔꿈치 → 손. 팔꿈치는 팔 길이로 계산해 몸 바깥·아래쪽으로 꺾는다.
// 굵은 외곽선 위에 소매와 피부를 단순한 면으로 채우는 만화 스타일.
Characters._OUTLINE = '#3a1f4d';

Characters._drawArm = function (ctx, sx, sy, hx, hy, side) {
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

  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // 팔 전체 외곽선
  ctx.strokeStyle = Characters._OUTLINE;
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(sx, sy);
  ctx.lineTo(ex, ey);
  ctx.lineTo(hx, hy);
  ctx.stroke();

  // 피부(윗팔 + 아랫팔)와 아랫팔 그림자 줄
  ctx.strokeStyle = '#ffd9c0';
  ctx.lineWidth = 5.2;
  ctx.beginPath();
  ctx.moveTo(sx, sy);
  ctx.lineTo(ex, ey);
  ctx.lineTo(hx, hy);
  ctx.stroke();
  ctx.strokeStyle = '#efb391';
  ctx.lineWidth = 1.3;
  ctx.beginPath();
  ctx.moveTo(ex - nx * 1.6, ey - ny * 1.6);
  ctx.lineTo(hx - nx * 1.6, hy - ny * 1.6);
  ctx.stroke();

  // 짧은 퍼프 소매: 외곽선 → 면 → 하이라이트
  ctx.strokeStyle = Characters._OUTLINE;
  ctx.lineWidth = 11;
  ctx.beginPath();
  ctx.moveTo(sx, sy);
  ctx.lineTo(sleeveX, sleeveY);
  ctx.stroke();
  ctx.strokeStyle = '#f08cc4';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(sx, sy);
  ctx.lineTo(sleeveX, sleeveY);
  ctx.stroke();
  ctx.strokeStyle = '#ffd0ea';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(sx - side * 1.5, sy - 1.5);
  ctx.lineTo(sleeveX - side * 1.5, sleeveY - 1.5);
  ctx.stroke();
};

// 손(응원봉을 쥔 주먹). 머리카락 앞에 그려야 해서 팔과 따로 그린다.
Characters._drawHand = function (ctx, hx, hy) {
  ctx.fillStyle = '#ffd9c0';
  ctx.strokeStyle = Characters._OUTLINE;
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.arc(hx, hy, 4.6, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#efb391';
  ctx.beginPath();
  ctx.arc(hx + 1.2, hy + 1.4, 2.2, 0, Math.PI * 2);
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
  ctx.strokeStyle = Characters._OUTLINE;
  ctx.lineWidth = 1.6;
  ctx.lineJoin = 'round';
  ctx.stroke();
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
  ctx.strokeStyle = Characters._OUTLINE;
  ctx.lineWidth = 1.6;
  ctx.lineJoin = 'round';
  ctx.stroke();
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

  // 팔은 긴 머리 뒤에서 나온다. 몸 뒤쪽 팔 → 앞쪽 팔 순서.
  var shoulderY = -43;
  var handX = p.hx;
  var handY = shoulderY + p.hy;
  if (pose === 'cheer') {
    Characters._drawArm(ctx, -11, shoulderY, -p.hx, handY, -1);
    Characters._drawHand(ctx, -p.hx, handY);
  }
  Characters._drawArm(ctx, 11, shoulderY, handX, handY, 1);

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
  ctx.strokeStyle = Characters._OUTLINE;
  ctx.lineWidth = 1.6;
  ctx.lineJoin = 'round';
  ctx.stroke();
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

  // 손과 응원봉은 머리카락 앞에 그린다.
  Characters._drawHand(ctx, handX, handY);
  Characters._drawLightstick(ctx, handX, handY, p.angle, g);

  ctx.restore();
};
