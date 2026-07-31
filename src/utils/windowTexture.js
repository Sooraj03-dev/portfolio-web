import * as THREE from 'three';

/**
 * Generate a CanvasTexture simulating lit/unlit building windows
 * @param {number} cols - number of window columns
 * @param {number} rows - number of window rows
 * @param {string[]} colors - array of possible lit window colors
 * @param {number} litRatio - ratio of windows that are lit (0-1)
 * @returns {THREE.CanvasTexture}
 */
export function createWindowTexture(
  cols = 8,
  rows = 20,
  colors = ['#00CCCC', '#00AAAA', '#006688', '#CCDDEE', '#FF88AA', '#FFFFFF'],
  litRatio = 0.7
) {
  const cellW = 16;
  const cellH = 16;
  const gap = 4;
  const w = cols * (cellW + gap) + gap;
  const h = rows * (cellH + gap) + gap;

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');

  // Dark building facade
  ctx.fillStyle = '#060A10';
  ctx.fillRect(0, 0, w, h);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = gap + c * (cellW + gap);
      const y = gap + r * (cellH + gap);
      const isLit = Math.random() < litRatio;

      if (isLit) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.3 + Math.random() * 0.7;
      } else {
        ctx.fillStyle = '#020408';
        ctx.globalAlpha = 1;
      }
      ctx.fillRect(x, y, cellW, cellH);
      ctx.globalAlpha = 1;
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.magFilter = THREE.NearestFilter;
  return texture;
}

/**
 * Flicker random windows on an existing canvas texture
 * @param {THREE.CanvasTexture} texture
 * @param {number} count - number of windows to toggle
 */
export function flickerWindows(texture, count = 10) {
  const canvas = texture.image;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const cellW = 16;
  const cellH = 16;
  const gap = 4;
  const cols = Math.floor((canvas.width - gap) / (cellW + gap));
  const rows = Math.floor((canvas.height - gap) / (cellH + gap));

  const flickerColors = ['#00CCCC', '#CCDDEE', '#FF88AA', '#00AAAA', '#020408'];

  for (let i = 0; i < count; i++) {
    const c = Math.floor(Math.random() * cols);
    const r = Math.floor(Math.random() * rows);
    const x = gap + c * (cellW + gap);
    const y = gap + r * (cellH + gap);
    const color = flickerColors[Math.floor(Math.random() * flickerColors.length)];
    ctx.fillStyle = color;
    ctx.globalAlpha = color === '#020408' ? 1 : 0.3 + Math.random() * 0.7;
    ctx.fillRect(x, y, cellW, cellH);
    ctx.globalAlpha = 1;
  }

  texture.needsUpdate = true;
}
