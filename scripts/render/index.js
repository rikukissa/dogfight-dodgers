import {ctx} from 'render/canvas';
import {ALIVE_TIME} from 'explosions';
import {gameToCanvas, cameraTranslation} from 'render/utils';

import {render as renderPlayer} from 'render/renderers/plane';
import {render as renderBackground} from 'render/renderers/background';
import {render as renderBullet} from 'render/renderers/bullet';
import {render as renderWorld} from 'render/renderers/world';

import fps from 'fps';
import 'style.css';

const ticker = fps({every: 10});

const $fps = document.getElementById('fps');
ticker.on('data', framerate => $fps.innerHTML = Math.round(framerate));


function renderExplosions({explosions}, currentTime) {
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

export function render({player, bullets, world, explosions, input}) {
  ctx.save();

  const translation = cameraTranslation(player);
  ctx.translate(translation.x, translation.y);

  renderBackground(translation);
  renderPlayer(player);
  bullets.bullets.forEach(renderBullet);
  renderWorld(world);
  renderExplosions(explosions, input.time);

  ctx.restore();
  ticker.tick();
}

export function renderFuture(future, {player}) {
  ctx.save();
  ctx.globalAlpha = 0.3;

  const translation = cameraTranslation(player);

  ctx.translate(
    translation.x + future.player.position.x - player.position.x,
    translation.y);

  renderPlayer(future.player);
  future.bullets.bullets.forEach(renderBullet);
  renderWorld(future.world);
  renderExplosions(future.explosions);
  ctx.restore();
}

require('hotReplaceNotifier')();
