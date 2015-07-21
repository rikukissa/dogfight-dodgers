import {
  image,
  scale,
  gameToCanvas
} from 'render/utils';

import {ctx} from 'render/canvas';
import {radians} from 'utils';

const SPRITE = image(require('url!bullet.png'));
const WIDTH = SPRITE.width;
const HEIGHT = SPRITE.height;

export function render(bullet) {

  const width = scale(bullet.dimensions.width);
  const height = scale(bullet.dimensions.height);

  const canvasCoordinates = gameToCanvas(bullet.position);

  ctx.save();

  ctx.translate(canvasCoordinates.x, canvasCoordinates.y);
  ctx.rotate(radians(bullet.angle));

  ctx.translate(-width / 2, height / 2);

  ctx.drawImage(SPRITE, 0, 0, WIDTH, HEIGHT, 0, 0, width, -height);
  ctx.restore();
}
