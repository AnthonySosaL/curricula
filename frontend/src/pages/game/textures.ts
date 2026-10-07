import * as THREE from 'three';

// Texturas procedurales (canvas 2D): cero descargas, pocos KB de GPU.
function canvasTex(w: number, h: number, draw: (ctx: CanvasRenderingContext2D) => void) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  draw(c.getContext('2d')!);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function noise(ctx: CanvasRenderingContext2D, w: number, h: number, n: number, alpha: number) {
  for (let i = 0; i < n; i++) {
    const v = Math.random() > 0.5 ? 255 : 0;
    ctx.fillStyle = `rgba(${v},${v},${v},${Math.random() * alpha})`;
    ctx.fillRect(Math.random() * w, Math.random() * h, 2, 2);
  }
}

/** Un carril: asfalto oscuro con grano. Repetir en X = 3 carriles. */
export function floorTextures() {
  const base = canvasTex(128, 256, (ctx) => {
    ctx.fillStyle = '#1a0a0b';
    ctx.fillRect(0, 0, 128, 256);
    noise(ctx, 128, 256, 1800, 0.12);
    ctx.fillStyle = '#0d0405';
    ctx.fillRect(0, 0, 3, 256);
    ctx.fillRect(125, 0, 3, 256);
  });
  // Líneas que brillan (emissiveMap): bordes de carril + junta transversal
  const glow = canvasTex(128, 256, (ctx) => {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, 128, 256);
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, 3, 256);
    ctx.fillRect(125, 0, 3, 256);
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.fillRect(0, 0, 128, 2);
  });
  for (const t of [base, glow]) {
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.anisotropy = 4; // solo la pista: se ve en ángulo rasante y es lo que más se mira
  }
  return { base, glow };
}

/** Cuadrícula para el terreno a los lados de la pista. */
export function gridTexture() {
  const t = canvasTex(64, 64, (ctx) => {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, 64, 64);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, 64, 64);
  });
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

/** Halo radial (sombra falsa / charcos de luz). */
export function radialTexture(inner = 'rgba(255,255,255,1)') {
  return canvasTex(64, 64, (ctx) => {
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, inner);
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 64);
  });
}

/** Sol retro con franjas horizontales. */
export function sunTexture() {
  return canvasTex(256, 256, (ctx) => {
    const g = ctx.createLinearGradient(0, 0, 0, 256);
    g.addColorStop(0, '#ffd27a');
    g.addColorStop(0.55, '#ff6a2b');
    g.addColorStop(1, '#d0123a');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(128, 128, 126, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = 'destination-out';
    for (let i = 0; i < 7; i++) {
      const y = 150 + i * 16;
      ctx.fillRect(0, y, 256, 2 + i * 1.4);
    }
  });
}

/** Ventanas encendidas para los edificios del fondo (emissiveMap). */
export function windowsTexture() {
  const t = canvasTex(64, 128, (ctx) => {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, 64, 128);
    for (let y = 4; y < 128; y += 10) {
      for (let x = 4; x < 64; x += 12) {
        if (Math.random() < 0.35) continue;
        ctx.fillStyle = `rgba(255,${120 + Math.random() * 80},80,${0.4 + Math.random() * 0.6})`;
        ctx.fillRect(x, y, 6, 4);
      }
    }
  });
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

/** Franjas de peligro para los obstáculos (emissiveMap). */
export function hazardTexture() {
  return canvasTex(128, 128, (ctx) => {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, 128, 128);
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 14, 128, 8);
    ctx.fillRect(0, 106, 128, 8);
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 34, 128, 60);
    ctx.clip();
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    for (let x = -64; x < 160; x += 32) {
      ctx.beginPath();
      ctx.moveTo(x, 94); ctx.lineTo(x + 16, 94); ctx.lineTo(x + 76, 34); ctx.lineTo(x + 60, 34);
      ctx.fill();
    }
    ctx.restore();
  });
}
