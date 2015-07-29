import {GROUND_LEVEL} from 'world';
import {RADIAN} from 'constants';
import {create} from 'plane';

const MAX_SPEED = 0.7;
const KEY_ROTATION = 0.05;

export function initial(world) {
  return create(null, world);
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

export function update(player, input) {

  if(input.keys.down) {
    player.body.angle += rotatePlane(player, -KEY_ROTATION) * input.delta;

    if(player.thrust < MAX_SPEED) {
      player.thrust += 0.005 * input.delta;
    }

  } else if(input.keys.up) {
    player.body.angle += rotatePlane(player, KEY_ROTATION) * input.delta;
  }


  player.thrust = Math.min(MAX_SPEED, player.thrust);

  const deltaAngle = Math.sin(player.body.angle - RADIAN / 2);
  player.thrust -= 0.005 * deltaAngle;


  if(player.body.position[1] <= GROUND_LEVEL) {
    player.body.position[1] = GROUND_LEVEL;
  }

  player.body.position[0] += player.thrust * Math.sin(player.body.angle + RADIAN * 0.25)
    * input.delta;

  player.body.position[1] += player.thrust * Math.cos(player.body.angle + RADIAN * 0.25)
    * input.delta;

  return player;
}

