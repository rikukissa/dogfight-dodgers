import radians from 'degrees-radians';
import extend from 'deep-extend';

const WIDTH = 0.75;
const HEIGHT = 0.3;

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
    velocity: {
      x: player.velocity.x + 0.5 * cos,
      y: player.velocity.y - 0.5 * sin
    },
    dimensions: {
      width: WIDTH,
      height: HEIGHT
    },
    angle: player.angle,
    ticksLived: 0
  }
}

function updateBullet(bullet) {
  const newBullet = extend({}, bullet);

  newBullet.position.x = bullet.position.x + bullet.velocity.x,
  newBullet.position.y = bullet.position.y + bullet.velocity.y
  newBullet.ticksLived++;

  return newBullet;
}

export function update(bullets, [player, input]) {
  const updatedBullets = bullets.bullets.reduce((bullets, bullet) => {
    if(bullet.ticksLived > 25) {
      return bullets;
    }
    return bullets.concat(updateBullet(bullet));
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

require('./hotReplaceNotifier')();
