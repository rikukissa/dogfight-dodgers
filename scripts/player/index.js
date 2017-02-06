import extend from 'extend';
import curry from 'lodash.curry';
import compose from 'lodash.compose';
import {getId} from 'utils';

import {RADIAN} from 'constants';
import {MAX_SPEED, MAX_THRUST, KEY_ROTATION, update as updatePlane, create} from 'plane';
import crate from 'crate';
import {createCollisionDispatcher} from 'utils';

export function initial() {
  return create({
    id: getId()
  });
}

function rotatePlane(plane, degrees) {
  const y = plane.body.position[1];
  const speed = Math.sqrt(Math.pow(plane.body.velocity[0], 2) + Math.pow(plane.body.velocity[1], 2))

  if(y < 2) {
    const deltaSpeed = speed / MAX_SPEED;
    return ((degrees / 10) * deltaSpeed);
  }

  if(y < 4) {
    return degrees * y / 4 * 0.5;
  }

  return degrees;
}

const updateForces = curry(function (delta, keys, plane) {
  let angle = plane.body.angle;
  let thrust = plane.thrust;

  const throttling = keys.down;
  const breaking = keys.up;

  if(throttling) {
    angle += rotatePlane(plane, -KEY_ROTATION) * delta;
    if(thrust < MAX_SPEED) {
      thrust += (MAX_THRUST / 100) * delta;
    }
  } else if(breaking) {
    angle += rotatePlane(plane, KEY_ROTATION) * delta;
  }

  return {
    ...plane,
    thrust,
    body: {
      ...plane.body,
      angle
    }
  };
});

export function update (state, delta) {
  return updatePlane(updateForces(delta, state.keys, state.player), delta);
}
