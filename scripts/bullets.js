import radians from 'degrees-radians';
import extend from 'deep-extend';

const WIDTH = 0.75;
const HEIGHT = 0.3;

import {GROUND_LEVEL} from './world';

export const initial = {
  bullets: [],
  sounds: {
    created: []
  }
};


function initialBullet(player) {
  const sin = Math.sin(radians(player.angle));
  const cos = Math.cos(radians(player.angle));

  // bullet hole isn't right in the middle of the plane
  const yOffset = player.dimensions.height * 0.06;

  return {
    position: {
      x: player.position.x + (player.dimensions.width / 2 + (WIDTH / 2)) * cos + yOffset * sin,
      y: player.position.y - (player.dimensions.width / 2 + (WIDTH / 2)) * sin + yOffset * cos
    },
    speed: player.thrust + 1,
    dimensions: {
      width: WIDTH,
      height: HEIGHT
    },
    angle: player.angle,
    ticksLived: 0,
    exploded: false
  }
}

function updateBullet(bullet, delta) {
  const newBullet = extend({}, bullet);

  newBullet.position.x += bullet.speed * Math.sin(radians(bullet.angle + 90)) * delta,
  newBullet.position.y += bullet.speed * Math.cos(radians(bullet.angle + 90)) * delta

  if(newBullet.position.y <= GROUND_LEVEL) {
    newBullet.exploded = true;
  }

  newBullet.ticksLived++;

  return newBullet;
}

export function update(bullets, [player, input]) {
  const updatedBullets = bullets.bullets.reduce((bullets, bullet) => {
    if(bullet.ticksLived > 25 || bullet.exploded) {
      return bullets;
    }
    return bullets.concat(updateBullet(bullet, input.delta));
  }, []);

  return {
    bullets: updatedBullets.concat(input.shoot.map(
      () => initialBullet(player)
    )),
    sounds: {
      created: input.shoot.map(() => true)
    }
  }
}

require('hotReplaceNotifier')();
