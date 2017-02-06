import curry from 'lodash.curry';
import compose from 'lodash.compose';
import {GROUND_LEVEL} from 'world';
import {RADIAN} from 'constants';

export const TYPE = 'adf';
export const WIDTH = 1.6;
export const HEIGHT = 1;
export const KEY_ROTATION = 0.05;

export const MAX_SPEED = 10;
export const MAX_THRUST = 10;


export function update(plane, delta) {
  return plane;
}

export function create(opts) {
  return {
    thrust: 0,
    throttle: 0,
    angularForce: 0,
    healt: 1,
    bullets: 20,
    ...opts
  };
}
