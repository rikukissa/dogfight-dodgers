import {GROUND_LEVEL} from 'world';
import {RADIAN} from 'constants';
import {create} from 'plane';
import crate from 'crate';
import extend from 'extend';
import {createCollisionDispatcher} from 'utils';
import curry from 'lodash.curry';
import compose from 'lodash.compose';

const MAX_SPEED = 0.7;
const KEY_ROTATION = 0.05;

// const collisionHandlers = new Map();

// collisionHandlers.set(crate, function(player) {
//   player.bullets += 20;
//   return player;
// });

export function initial(world) {
  return extend(create(null, world), {
    createdBullets: []
  });
}

function rotatePlane(player, degrees) {
  const y = player.body.position[1];

  if(y < 2) {
    const deltaSpeed = player.thrust / MAX_SPEED;
    return ((degrees / 10) * deltaSpeed);
  }

  if(y < 4) {
    return degrees * y / 4 * 0.5;
  }

  return degrees;
}

// const handleCollisions = createCollisionDispatcher(collisionHandlers);

const createNewBullets = curry(function createNewBullets(input, player) {

  const createdBullets = input.shoot.slice(0, player.bullets).map(() => true);
  const bullets = player.bullets - player.createdBullets.length;

  return {
    ...player,
    createdBullets,
    bullets
  };
});

const updateForces = curry(function (delta, input, player) {
  let angle = player.body.angle;
  let thrust = player.thrust;

  if(input.keys.down) {
    angle += rotatePlane(player, -KEY_ROTATION) * delta;

    if(thrust < MAX_SPEED) {
      thrust += 0.005 * delta;
    }

  } else if(input.keys.up) {
    angle += rotatePlane(player, KEY_ROTATION) * delta;
  }

  const deltaAngle = Math.sin(angle - RADIAN / 2);
  const drag = 0.005 * deltaAngle * delta;

  return {
    ...player,
    thrust: Math.min(MAX_SPEED, thrust) - drag,
    body: {
      ...player.body,
      angle
    }
  };
});

const updatePosition = curry(function (delta, player) {
  const x = player.body.position[0];
  const y = player.body.position[1] <= GROUND_LEVEL ? GROUND_LEVEL : player.body.position[1];

  return {
    ...player,
    body: {
      ...player.body,
      position: [
        x + player.thrust * Math.sin(player.body.angle + RADIAN * 0.25) * delta,
        y + player.thrust * Math.cos(player.body.angle + RADIAN * 0.25) * delta
      ]
    }
  };
});

export function update(player, input, delta) {
  return compose(
    createNewBullets(input),
    updatePosition(delta),
    updateForces(delta)
  )(input, player);
}

