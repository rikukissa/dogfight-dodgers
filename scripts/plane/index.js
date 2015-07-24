import p2 from 'p2';
import {GROUND_LEVEL} from 'world';

const MAX_SPEED = 0.5;
const KEY_ROTATION = 0.0698;
const STALL_ROTATION = 0.00698;
const RADIAN = 6.283185307179586;

export const WIDTH = 1.6;
export const HEIGHT = 1;

export function initial(world) {

  const body = new p2.Body({
    mass: 0,
    angle: 0,
    position: [3, GROUND_LEVEL + HEIGHT/2]
  });

  world.addBody(body);

  body.addShape(new p2.Box({
    width: WIDTH,
    height: HEIGHT
  }));

  return {
    body: body,
    thrust: 0,
    throttle: 0,
    healt: 1
  }
};

function mod(num, from) {
  return (num % from + from) % from;
}

function stallPlane(player, delta) {
  const normalized = mod(player.body.angle + RADIAN * 0.25, RADIAN);
  const distance = 180 - normalized;
  return player.body.angle + distance * (STALL_ROTATION - STALL_ROTATION * player.healt) * delta;
}

export function update(player, [input]) {

  if(input.keys.up) {
    player.throttle += 0.001 * input.time.delta;
  } else {
    player.throttle = 0;
  }

  if(input.keys.left) {

    const tailY = player.body.position[1] + 0.15 - (HEIGHT / 2) *
      Math.sin(player.body.angle - RADIAN/2);

    if(tailY > 0) {
      player.body.angle -= KEY_ROTATION * input.time.delta;
    }
  } else if(input.keys.right) {
    player.body.angle += KEY_ROTATION * input.time.delta;
  } else if(player.body.position[1] > GROUND_LEVEL) {
    player.body.angle = stallPlane(player, input.time.delta);
  }


  player.thrust = Math.min(MAX_SPEED, player.thrust + player.throttle);
  player.thrust = Math.max(0, player.thrust + 0.01 * Math.max(0, Math.sin(player.body.angle)));


  if(player.body.position[1] <= GROUND_LEVEL) {
    player.body.position[1] = GROUND_LEVEL;
  }

  player.body.position[0] += player.thrust * Math.sin(player.body.angle + RADIAN * 0.25) * input.time.delta;
  player.body.position[1] += player.thrust * Math.cos(player.body.angle + RADIAN * 0.25) * input.time.delta;

  return player;
}
require('hotReplaceNotifier')();
