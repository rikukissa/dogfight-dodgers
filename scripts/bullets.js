import radians from 'degrees-radians';
import extend from 'deep-extend';

const WIDTH = 0.75;
const HEIGHT = 0.3;

function initialBullet(player) {
  return {
    position: {
      x: player.position.x + (player.dimensions.width / 2 + (WIDTH / 2)) * Math.cos(radians(player.angle)),
      y: player.position.y - (player.dimensions.height / 2 + (WIDTH / 2)) * Math.sin(radians(player.angle))
    },
    velocity: {
      x: player.velocity.x + 0.5 * Math.cos(radians(player.angle)),
      y: player.velocity.y - 0.5 * Math.sin(radians(player.angle))
    },
    dimensions: {
      width: WIDTH,
      height: HEIGHT
    },
    angle: player.angle,
    ticksLived: 0
  }
}

export function update(bullets, [player, input]) {
  const newBullets = bullets.reduce((bullets, bullet) => {
    if(bullet.ticksLived > 25) {
      return bullets;
    }

    const newBullet = extend({}, bullet);

    newBullet.position.x = bullet.position.x + bullet.velocity.x,
    newBullet.position.y = bullet.position.y + bullet.velocity.y
    newBullet.ticksLived++;

    return bullets.concat(newBullet);
  }, []);

  // Add new bullets
  return input.shoot.reduce((bullets) => {
    return bullets.concat(initialBullet(player));
  }, newBullets);
}

require('./hotReplaceNotifier')();
