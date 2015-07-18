import radians from 'degrees-radians';
import extend from 'extend';

const MAX_SPEED = 10;

export const initial = {
  position: {
    x: 3,
    y: 1
  },
  angle: 0,
  thrust: 0,
  throttle: 0,
  velocity: {
    x: 0,
    y: 0
  },
  dimensions: {
    height: 1,
    width: 1.6
  }
};

export function update(player, input) {
  const newPlayer = extend({}, player, {
    position: extend({}, player.position),
    velocity: extend({}, player.velocity)
  });

  if(input.keys.up) {
    newPlayer.throttle += 0.001;
  } else {
    newPlayer.throttle = 0;
  }

  if(input.keys.left) {
    newPlayer.angle -= 2;
  }

  if(input.keys.right) {
    newPlayer.angle += 2;
  }


  newPlayer.thrust += newPlayer.throttle;

  newPlayer.velocity.x = newPlayer.thrust * Math.sin(radians(newPlayer.angle + 90));
  newPlayer.velocity.y = newPlayer.thrust * Math.cos(radians(newPlayer.angle + 90));

  newPlayer.thrust /= 1 - 0.2 * Math.sin(radians(player.angle));

  newPlayer.thrust = Math.min(0.7, newPlayer.thrust);


  newPlayer.position.x += newPlayer.velocity.x;
  newPlayer.position.y += newPlayer.velocity.y;

  newPlayer.velocity.y -= 0.01;


  /*
   * forces of nature
   */

  // newPlayer.velocity.x -= newPlayer.velocity.x / 40; // drag
  // newPlayer.thrust -= 0.1; // gravity

  // Limits
  // newPlayer.velocity.x = Math.min(MAX_SPEED, newPlayer.velocity.x)
  // newPlayer.velocity.y = Math.min(5, newPlayer.velocity.y)
  // newPlayer.position.y = Math.max(0, newPlayer.position.y);

  // newPlayer.angle = -newPlayer.velocity.y / 5 * 45;

  if(newPlayer.position.y <= 0) {
    newPlayer.position.y = 0;
    newPlayer.velocity.y = Math.max(0, newPlayer.velocity.y);
  }

  return newPlayer;
}

require('./hotReplaceNotifier')();
