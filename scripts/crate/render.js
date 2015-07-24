import {
  image,
  scale,
  bodyToCanvas
} from 'render/utils';

import {ctx} from 'render/canvas';
import {CRATE_SIZE} from 'crate';

const CRATE_SPRITE = image(require('url!crate.png'));

export function render(crate) {
  const width = scale(CRATE_SIZE);
  const height = scale(CRATE_SIZE);

  const canvasCoordinates = bodyToCanvas(crate.body);

  ctx.save();

  ctx.translate(canvasCoordinates.x, canvasCoordinates.y);
  ctx.rotate(crate.body.angle);

  ctx.translate(-width / 2, -height / 2);

  ctx.drawImage(CRATE_SPRITE, 0, 0, width, height);
  // ctx.strokeRect(0, 0, width, height);
  ctx.restore();

}
