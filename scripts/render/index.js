import {ctx} from 'render/canvas';
import {cameraTranslation} from 'render/utils';

import {render as renderPlane} from 'plane/render';
import {render as renderBackground} from 'background/render';
import {render as renderBullet} from 'bullets/render';
import {render as renderCrate} from 'crate/render';
import {engine} from 'physics';

import {
  scale,
  bodyToCanvas
} from 'render/utils';

const GROUND_LEVEL = -30;

import fps from 'fps';
import 'style.css';

const ticker = fps({every: 10});

const $fps = document.getElementById('fps');
const $player = document.getElementById('player');
const $body = document.getElementById('body');

ticker.on('data', framerate =>
  $fps.innerHTML = Math.round(framerate)
);

function debugRenderer(body, delta) {
  // @todo not rendering planes
  const canvasCoordinates = bodyToCanvas(body);

  body.shapes.forEach((shape) => {
    const width = scale(shape.width);
    const height = scale(shape.height);

    ctx.save();

    ctx.translate(canvasCoordinates.x, canvasCoordinates.y);
    ctx.rotate(body.angle);
    ctx.translate(-width / 2, -height / 2);


    ctx.fillStyle = 'rgba(10, 247, 0, 0.5)';
    ctx.strokeStyle = 'rgba(10, 247, 0, 0.9)';

    ctx.fillRect(0, 0, width, height);
    ctx.strokeRect(0, 0, width, height);


    ctx.restore();
  });

  ctx.save();
  const width = scale(body.force[0]);
  const height = scale(body.force[1]);
  ctx.translate(canvasCoordinates.x, canvasCoordinates.y);

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(-width / delta, height / delta);
  ctx.strokeStyle = 'red';
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.restore();

}


export function render({player, bullets, crates, enemies, elapsedTime, bodies, lastDelta}) {
  ctx.save();

  const translation = cameraTranslation(player);
  ctx.translate(translation.x, translation.y);

  renderBackground(translation, elapsedTime);

  ctx.translate(0, GROUND_LEVEL);

  renderPlane(player);
  bullets.forEach(renderBullet);
  // crates.crates.forEach(renderCrate);

  for(let id in enemies) {
    renderPlane(enemies[id]);
  }
  engine.bodies.forEach((plane) => debugRenderer(plane, lastDelta));
  $player.innerHTML = JSON.stringify(player, null, 2);
  ctx.restore();
  ticker.tick();
}


