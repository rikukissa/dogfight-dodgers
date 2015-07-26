import {ctx} from 'render/canvas';
import {cameraTranslation} from 'render/utils';

import {render as renderPlayer} from 'plane/render';
import {render as renderBackground} from 'background/render';
import {render as renderBullet} from 'bullet/render';
import {render as renderCrate} from 'crate/render';

const GROUND_LEVEL = -30;

import fps from 'fps';
import 'style.css';

const ticker = fps({every: 10});

const $fps = document.getElementById('fps');

ticker.on('data', framerate =>
  $fps.innerHTML = Math.round(framerate)
);

export function render({player, bullets, crates}) {
  ctx.save();

  const translation = cameraTranslation(player);
  ctx.translate(translation.x, translation.y);

  renderBackground(translation);

  ctx.translate(0, GROUND_LEVEL);

  renderPlayer(player);

  bullets.bullets.forEach(renderBullet);
  crates.crates.forEach(renderCrate);

  ctx.restore();
  ticker.tick();
}


