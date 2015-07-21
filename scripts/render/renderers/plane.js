import {
  image,
  scale,
  gameToCanvas
} from 'render/utils';

import {radians} from 'utils';
import {ctx} from 'render/canvas';

const SPRITE = image(require('url!plane.png'));
const WIDTH = 119;
const HEIGHT = 74;

export function render(plane) {

  const width = scale(plane.dimensions.width);
  const height = scale(plane.dimensions.height);

  const canvasCoordinates = gameToCanvas(plane.position);

  ctx.save();

  ctx.translate(canvasCoordinates.x, canvasCoordinates.y);
  ctx.rotate(radians(plane.angle));

  ctx.translate(-width / 2, height / 2);

  ctx.drawImage(SPRITE, 0, 0, WIDTH, HEIGHT, 0, 0, width, -height);
  ctx.restore();
}
