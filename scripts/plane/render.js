import {
  image,
  scale,
  bodyToCanvas
} from 'render/utils';

import {ctx} from 'render/canvas';
import {WIDTH, HEIGHT} from 'plane';
const SPRITE = image(require('url!plane.png'));

export function render(plane) {

  const width = scale(WIDTH);
  const height = scale(HEIGHT);

  const canvasCoordinates = bodyToCanvas(plane.body);

  ctx.save();

  ctx.translate(canvasCoordinates.x, canvasCoordinates.y);
  ctx.rotate(plane.body.angle);

  ctx.translate(-width / 2, -height / 2);

  ctx.drawImage(SPRITE, 0, 0, SPRITE.width, SPRITE.height, 0, 0, width, height);

  // ctx.strokeRect(0, 0, width, height);

  ctx.restore();

}
