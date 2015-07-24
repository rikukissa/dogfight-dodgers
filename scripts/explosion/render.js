import {
  gameToCanvas
} from 'render/utils';

import {ctx} from 'render/canvas';
import {ALIVE_TIME} from 'explosions';

export function render({explosions}, currentTime) {
  ctx.save();
  ctx.fillStyle = 'red';

  explosions.forEach((explosion) => {
    const delta = (currentTime - explosion.created) / ALIVE_TIME;

    const multiplier = 1 - Math.abs(0.15 - delta);

    const position = gameToCanvas(explosion.position);
    ctx.fillRect(
      position.x,
      position.y,
      20 * multiplier, 20 * multiplier
    );
  });
  ctx.restore();
}
