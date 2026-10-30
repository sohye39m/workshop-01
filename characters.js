// Characters: 아이돌·팬 그리기
// 담당: Builder B inayun059-afk — 이 파일은 담당자만 수정한다. 인터페이스는 SPEC.md 5장.

var Characters = {};

// 포즈별 응원봉 자세. 어깨 기준 손 위치(hx, hy)와 봉의 각도(rad, 0이 위쪽, +는 오른쪽으로 기움)
Characters._fanPoses = {
  idle:  { hx: 16,  hy: -2,  angle: 0.15,  up: false },
  swing: { hx: 24,  hy: -10, angle: 0.9,   up: false },
  ready: { hx: 14,  hy: -26, angle: 0,     up: true },
  cheer: { hx: 16,  hy: -30, angle: -0.25, up: true },
  droop: { hx: 14,  hy: 8,   angle: 2.9,   up: false }
};

// 팬 뒷모습 하나를 그린다. (x, y)는 발치 중앙, glow는 불빛 크기 배율(기본 1)
Characters.drawFan = function (ctx, x, y, pose, glow) {
  var p = Characters._fanPoses[pose] || Characters._fanPoses.idle;
  var g = typeof glow === 'number' ? glow : 1;

  ctx.save();
  ctx.translate(x, y);

  // 몸통(뒷모습)
  ctx.fillStyle = '#3b3f66';
  ctx.beginPath();
  ctx.moveTo(-18, 0);
  ctx.lineTo(-14, -44);
  ctx.quadraticCurveTo(0, -52, 14, -44);
  ctx.lineTo(18, 0);
  ctx.closePath();
  ctx.fill();

  // 머리와 머리카락
  ctx.fillStyle = '#f2c9a5';
  ctx.beginPath();
  ctx.arc(0, -60, 11, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#2a2233';
  ctx.beginPath();
  ctx.arc(0, -62, 11, Math.PI, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(-11, -62, 22, 7);

  // 팔: 어깨에서 손까지
  ctx.strokeStyle = '#3b3f66';
  ctx.lineWidth = 7;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(12, -42);
  ctx.lineTo(p.hx, -44 + p.hy);
  ctx.stroke();
  if (pose === 'cheer') {
    // cheer는 왼팔도 든다
    ctx.beginPath();
    ctx.moveTo(-12, -42);
    ctx.lineTo(-p.hx, -44 + p.hy);
    ctx.stroke();
  }

  // 응원봉: 손에서 angle 방향으로 뻗는다
  var hx = p.hx;
  var hy = -44 + p.hy;
  var len = 30;
  var tx = hx + Math.sin(p.angle) * len;
  var ty = hy - Math.cos(p.angle) * len;
  ctx.strokeStyle = '#d9d9e8';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(hx, hy);
  ctx.lineTo(tx, ty);
  ctx.stroke();

  // 불빛(번지는 빛 + 알맹이)
  var r = 7 * g;
  var halo = ctx.createRadialGradient(tx, ty, 0, tx, ty, r * 2.4);
  halo.addColorStop(0, 'rgba(255, 120, 200, 0.85)');
  halo.addColorStop(1, 'rgba(255, 120, 200, 0)');
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(tx, ty, r * 2.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ff5fb8';
  ctx.beginPath();
  ctx.arc(tx, ty, r, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
};
