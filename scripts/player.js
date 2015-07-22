import radians from 'degrees-radians';
import extend from 'deep-extend';
import {GROUND_LEVEL} from 'world';

const MAX_SPEED = 0.5;

export const initial = {
  position: {
    x: 3,
    y: GROUND_LEVEL
  },
  angle: 0,
  thrust: 0,
  throttle: 0,
  healt: 1,
  dimensions: {
    height: 1,
    width: 1.6
  }
};

function mod(num, from) {
  return (num % from + from) % from;
}

function stallPlane(player, delta) {
  const normalized = mod(player.angle + 90, 360);
  const distance = 180 - normalized;
  return player.angle + distance * (0.05 - 0.04 * player.healt) * delta;
}

export function update(player, input) {

  const newPlayer = extend({}, player);

  if(input.keys.up) {
    newPlayer.throttle += 0.001 * input.delta;
  } else {
    newPlayer.throttle = 0;
  }

  if(input.keys.left) {

    const tailY = newPlayer.position.y + 0.15 - (newPlayer.dimensions.height / 2) *
      Math.sin(radians(newPlayer.angle - 180));

    if(tailY > 0) {
      newPlayer.angle -= 4 * input.delta;
    }
  } else if(input.keys.right) {
    newPlayer.angle += 4 * input.delta;
  } else if(newPlayer.position.y > GROUND_LEVEL) {
    newPlayer.angle = stallPlane(newPlayer, input.delta);
  }


  newPlayer.thrust = Math.min(MAX_SPEED, newPlayer.thrust + newPlayer.throttle);

  newPlayer.thrust = Math.max(0,
    newPlayer.thrust + 0.01 * Math.max(0, Math.sin(radians(newPlayer.angle))));


  if(newPlayer.position.y <= GROUND_LEVEL) {
    newPlayer.position.y = GROUND_LEVEL;
  }

  newPlayer.position.x += newPlayer.thrust * Math.sin(radians(newPlayer.angle + 90)) * input.delta;
  newPlayer.position.y += newPlayer.thrust * Math.cos(radians(newPlayer.angle + 90)) * input.delta;

  return newPlayer;
}
require('hotReplaceNotifier')();
