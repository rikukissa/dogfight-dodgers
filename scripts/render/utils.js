import {canvas, ctx} from 'render/canvas';
import {SCALE} from 'render/constants';
import {WIDTH} from 'world';

export function scale(num) {
  return num / SCALE;
}

export function gameToCanvas({x, y}) {
  return {
    x: x / SCALE,
    y: canvas.height - y / SCALE
  };
}

export function rectPath(x, y, w, h) {
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + w, y);
  ctx.lineTo(x + w, y + h);
  ctx.lineTo(x, y + h);
  ctx.closePath();
}

export function cameraTranslation(player) {
  const playerOnCanvas = gameToCanvas(player.position);

  return {
    x: Math.max(-(scale(WIDTH) - canvas.width), Math.min(0, canvas.width / 2 - playerOnCanvas.x)),
    y: Math.max(0, canvas.height / 2 - playerOnCanvas.y)
  };
}

export function toRGB(arr) {
  return `rgb(${arr.join(',')})`;
}

export function image(src) {
  const img = new Image();
  img.src = src;
  return img;
}
