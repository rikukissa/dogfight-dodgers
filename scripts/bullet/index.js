import p2 from 'p2';
import {WIDTH as PLANE_WIDTH, HEIGHT as PLANE_HEIGHT} from 'plane';
export const WIDTH = 0.75;
export const HEIGHT = 0.3;
export const ALIVE_TIME = 25;
const RADIAN = 6.283185307179586;

export function initial(world) {
  return {
    bullets: [],
    explosions: [],
    sounds: {
      created: []
    }
  };
};


function initialBullet(player) {
  const sin = Math.sin(player.body.angle);
  const cos = Math.cos(player.body.angle);

  // bullet hole isn't right in the middle of the plane
  const yOffset = PLANE_HEIGHT * 0.06;

  const body = new p2.Body({
    mass: 0,
    angle: player.body.angle,
    position: [
      player.body.position[0] + (PLANE_WIDTH / 2 + (WIDTH)) * cos + yOffset * sin,
      player.body.position[1] - (PLANE_WIDTH / 2 + (WIDTH)) * sin + yOffset * cos
    ],
    velocity: [
      (30 + player.body.velocity[0]) * Math.sin(player.body.angle + RADIAN * 0.25),
      (30 + player.body.velocity[1]) * Math.cos(player.body.angle + RADIAN * 0.25)
    ]
  });

  body.addShape(new p2.Box({
    width: WIDTH,
    height: HEIGHT
  }));

  return {
    body: body,
    ticksLived: 0,
    exploded: false
  };
}

function updateBullet(bullet, world, delta) {
  bullet.ticksLived += delta;

  for(let {bodyA, bodyB} of world.impacts) {
    if(bullet.body === bodyA || bullet.body === bodyB) {
      bullet.exploded = true;
      return bullet;
    }
  }

  // bullet.body.angle = -bullet.body.angularVelocity;

  return bullet;
}

function create(player, world) {
  const bullet = initialBullet(player);
  world.addBody(bullet.body);
  return bullet;
}

export function update(bullets, [input, world, player]) {

  const updatedBullets = bullets.bullets.map((bullet) => {
    return updateBullet(bullet, world, input.time.delta);
  });

  const newBullets = updatedBullets.filter((bullet) => {
    if(bullet.ticksLived > ALIVE_TIME || bullet.exploded) {
      world.removeBody(bullet.body);
      return false;
    }
    return true;
  });

  return {
    bullets: newBullets.filter(b => !b.exploded)
      .concat(input.shoot.map(() => create(player, world))),
    explosions: updatedBullets.filter((bullet) => bullet.exploded),
    sounds: {
      created: input.shoot.map(() => true)
    }
  };
}

require('hotReplaceNotifier')();