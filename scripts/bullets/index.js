import {WIDTH as PLANE_WIDTH, HEIGHT as PLANE_HEIGHT} from 'plane';
import {RADIAN} from 'constants';

export const WIDTH = 0.75;
export const HEIGHT = 0.3;
export const ALIVE_TIME = 25;

export function initial() {
  return {
    bullets: [],
    explosions: [],
    sounds: {
      created: []
    }
  };
}

function initialBullet(player) {
  const sin = Math.sin(player.body.angle);
  const cos = Math.cos(player.body.angle);

  // bullet hole isn't right in the middle of the plane
  const yOffset = PLANE_HEIGHT * 0.06;

  return {
    id: Date.now(),
    body: {
      mass: 0.1,
      angle: player.body.angle,
      position: [
        player.body.position[0] + (PLANE_WIDTH / 2 + (WIDTH)) * cos + yOffset * sin,
        player.body.position[1] - (PLANE_WIDTH / 2 + (WIDTH)) * sin + yOffset * cos
      ]
    },
    thrust: player.thrust + 1,
    ticksLived: 0,
    exploded: false
  };
}

function updateBullet(delta, collisions, bullet) {
  bullet.ticksLived += delta;

  const x = bullet.body.position[0] + bullet.thrust
    * Math.sin(bullet.body.angle + RADIAN * 0.25) * delta;

  const y = bullet.body.position[1] + bullet.thrust
    * Math.cos(bullet.body.angle + RADIAN * 0.25) * delta;

  return {
    ...bullet,
    ticksLived: bullet.ticksLived + delta,
    body: {
      ...bullet.body,
      position: [x, y]
    }
  };
}

function create(player) {
  return initialBullet(player);
}

export function update({bullets, collisions}, player, input, delta) {

  const updatedBullets = bullets.map(updateBullet.bind(null, delta, collisions))
    .filter((bullet) => !(bullet.ticksLived > ALIVE_TIME || bullet.exploded));

  const newBullets = input.shoot ? [create(player)] : [];

  return updatedBullets.concat(newBullets);
}


