import * as THREE from 'three';

/**
 * Creates a purple female figure billboard CanvasTexture
 */
export function createPurpleFigureBillboard(width = 512, height = 768) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // Background: radial gradient
  const bgGrad = ctx.createRadialGradient(
    width / 2, height / 2, 50,
    width / 2, height / 2, height * 0.6
  );
  bgGrad.addColorStop(0, '#2A0050');
  bgGrad.addColorStop(1, '#000010');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Glow halo behind figure
  const glow = ctx.createRadialGradient(
    width / 2, height * 0.45, 20,
    width / 2, height * 0.45, 180
  );
  glow.addColorStop(0, 'rgba(153, 0, 255, 0.4)');
  glow.addColorStop(1, 'transparent');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);

  // Female silhouette (simplified)
  ctx.fillStyle = '#9900FF';
  ctx.beginPath();
  // Head
  ctx.arc(width / 2, height * 0.18, 30, 0, Math.PI * 2);
  ctx.fill();
  // Neck
  ctx.fillRect(width / 2 - 8, height * 0.21, 16, 20);
  // Torso
  ctx.beginPath();
  ctx.moveTo(width / 2 - 45, height * 0.25);
  ctx.lineTo(width / 2 + 45, height * 0.25);
  ctx.lineTo(width / 2 + 35, height * 0.5);
  ctx.lineTo(width / 2 - 35, height * 0.5);
  ctx.closePath();
  ctx.fill();
  // Hips/skirt
  ctx.beginPath();
  ctx.moveTo(width / 2 - 35, height * 0.5);
  ctx.lineTo(width / 2 + 35, height * 0.5);
  ctx.lineTo(width / 2 + 50, height * 0.75);
  ctx.lineTo(width / 2 - 50, height * 0.75);
  ctx.closePath();
  ctx.fill();
  // Legs
  ctx.fillRect(width / 2 - 25, height * 0.73, 18, height * 0.2);
  ctx.fillRect(width / 2 + 7, height * 0.73, 18, height * 0.2);

  // Cyan rim light on right edge
  ctx.strokeStyle = '#00FFFF';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(width / 2 + 45, height * 0.25);
  ctx.lineTo(width / 2 + 35, height * 0.5);
  ctx.lineTo(width / 2 + 50, height * 0.75);
  ctx.lineTo(width / 2 + 25, height * 0.93);
  ctx.stroke();

  // Floor glow line
  const floorGrad = ctx.createLinearGradient(0, height * 0.94, width, height * 0.94);
  floorGrad.addColorStop(0, 'transparent');
  floorGrad.addColorStop(0.3, '#9900FF');
  floorGrad.addColorStop(0.7, '#9900FF');
  floorGrad.addColorStop(1, 'transparent');
  ctx.strokeStyle = floorGrad;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, height * 0.94);
  ctx.lineTo(width, height * 0.94);
  ctx.stroke();

  // Top text
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '14px monospace';
  ctx.textAlign = 'center';
  ctx.globalAlpha = 0.7;
  ctx.fillText('NETWATCH', width / 2, 30);
  ctx.globalAlpha = 1;

  // Bottom text
  ctx.fillStyle = '#9900FF';
  ctx.font = '16px monospace';
  ctx.fillText('NEURAL LINK +', width / 2, height - 20);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

/**
 * Creates a multi-panel screen grid billboard CanvasTexture
 */
export function createMultiScreenBillboard(
  width = 512,
  height = 512,
  colors = ['#0088FF', '#FF2288', '#00FFCC', '#FF8800']
) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#020408';
  ctx.fillRect(0, 0, width, height);

  const halfW = width / 2;
  const halfH = height / 2;
  const pad = 4;

  // 4 panels in 2x2 grid
  const panels = [
    { x: pad, y: pad, w: halfW - pad * 1.5, h: halfH - pad * 1.5 },
    { x: halfW + pad * 0.5, y: pad, w: halfW - pad * 1.5, h: halfH - pad * 1.5 },
    { x: pad, y: halfH + pad * 0.5, w: halfW - pad * 1.5, h: halfH - pad * 1.5 },
    { x: halfW + pad * 0.5, y: halfH + pad * 0.5, w: halfW - pad * 1.5, h: halfH - pad * 1.5 },
  ];

  panels.forEach((p, i) => {
    const grad = ctx.createLinearGradient(p.x, p.y, p.x + p.w, p.y + p.h);
    grad.addColorStop(0, colors[i]);
    grad.addColorStop(1, '#000000');
    ctx.fillStyle = grad;
    ctx.globalAlpha = 0.7;
    ctx.fillRect(p.x, p.y, p.w, p.h);
    ctx.globalAlpha = 1;

    // Scanline overlay
    for (let y = p.y; y < p.y + p.h; y += 4) {
      ctx.fillStyle = 'rgba(0,0,0,0.15)';
      ctx.fillRect(p.x, y, p.w, 2);
    }
  });

  // Panel 4: data stream text
  ctx.fillStyle = '#00FFCC';
  ctx.font = '10px monospace';
  ctx.globalAlpha = 0.6;
  for (let i = 0; i < 12; i++) {
    const dataStr = Array.from({ length: 20 }, () =>
      Math.random().toString(16).charAt(2)
    ).join('');
    ctx.fillText(dataStr, panels[3].x + 4, panels[3].y + 16 + i * 16);
  }
  ctx.globalAlpha = 1;

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

/**
 * Creates a corporate sign billboard
 */
export function createCorporateBillboard(
  text = 'MILITECH',
  width = 512,
  height = 256,
  color = '#00E5CC'
) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // Dark background
  ctx.fillStyle = '#020810';
  ctx.fillRect(0, 0, width, height);

  // Gradient bar
  const barGrad = ctx.createLinearGradient(0, height * 0.3, width, height * 0.3);
  barGrad.addColorStop(0, 'transparent');
  barGrad.addColorStop(0.2, color);
  barGrad.addColorStop(0.8, color);
  barGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = barGrad;
  ctx.globalAlpha = 0.15;
  ctx.fillRect(0, height * 0.25, width, height * 0.5);
  ctx.globalAlpha = 1;

  // Main text
  ctx.fillStyle = color;
  ctx.font = 'bold 48px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, width / 2, height / 2);

  // Glow
  ctx.shadowColor = color;
  ctx.shadowBlur = 20;
  ctx.fillText(text, width / 2, height / 2);
  ctx.shadowBlur = 0;

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}
