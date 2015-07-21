import {
  image,
  scale,
  gameToCanvas
} from 'render/utils';

import {ctx} from 'render/canvas';
import {CRATE_WIDTH} from 'world';

const CRATE_SPRITE = image(require('url!crate.png'));

function renderCrate(crate) {
  const width = scale(CRATE_WIDTH);
  const height = scale(CRATE_WIDTH);

  const canvasCoordinates = gameToCanvas(crate.position);

  ctx.save();

  ctx.translate(canvasCoordinates.x, canvasCoordinates.y);

  ctx.translate(-width / 2, height / 2);

  ctx.drawImage(CRATE_SPRITE, 0, 0, width, -height);
  ctx.restore();
}

export function render({crates}) {
  crates.forEach(renderCrate);
}
