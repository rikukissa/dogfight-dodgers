import {
  image,
  scale,
  bodyToCanvas
} from 'render/utils';

import {ctx, canvas} from 'render/canvas';
import {WIDTH, HEIGHT} from 'plane';
import {GROUND_LEVEL} from 'render/constants';
const SPRITE = image(require('url!plane.png'));

const width = scale(WIDTH);
const height = scale(HEIGHT);

const groundLevel = scale(GROUND_LEVEL);

export function render(plane) {

  const canvasCoordinates = bodyToCanvas(plane.body);

  ctx.save();

  /*
   * Shadow
   */

   const delta = Math.max(0, 1 - plane.body.position[1] / 3);

  const scaleX = 2 / delta;
  const scaleY = 0.15 * delta;

  ctx.save();
  ctx.translate(canvasCoordinates.x, canvas.height - groundLevel + height);
  ctx.beginPath();
  ctx.scale(1, scaleY);

  ctx.arc(0, height / (scaleY * 2), width / scaleX, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(0, 0, 0, ${0.2 + 0.4 * delta})`;
  ctx.fill();
  ctx.restore();

  ctx.translate(canvasCoordinates.x, canvasCoordinates.y);
  ctx.rotate(plane.body.angle);
  ctx.translate(-width / 2, -height / 2);
  ctx.drawImage(SPRITE, 0, 0, SPRITE.width, SPRITE.height, 0, 0, width, height);


  // ctx.strokeRect(0, 0, width, height);

  ctx.restore();

}
