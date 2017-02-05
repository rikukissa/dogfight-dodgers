import {ctx} from 'render/canvas';
import {cameraTranslation} from 'render/utils';

import {render as renderPlane} from 'plane/render';
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

export function render({player, bullets, crates, planes, elapsedTime}) {
  ctx.save();

  const translation = cameraTranslation(player);
  ctx.translate(translation.x, translation.y);

  renderBackground(translation, elapsedTime);

  ctx.translate(0, GROUND_LEVEL);

  renderPlane(player);

  bullets.forEach(renderBullet);
  // crates.crates.forEach(renderCrate);

  for(let id in planes) {
    renderPlane(planes[id]);
  }

  ctx.restore();
  ticker.tick();
}


