import zipObject from 'lodash.zipobject';
import radians from 'degrees-radians';

export function randomGenerator(seed = 1) {
  return function() {
    const x = Math.sin(seed++) * 10000; // eslint-disable-line no-param-reassign
    return x - Math.floor(x);
  };
}

export function random(randomFn, min, max) {
  return randomFn() * (max - min) + min;
}

export function toObject(...keys) {
  return function(...values) {
    return zipObject(keys, values);
  };
}

export function clamp(min, max, num) {
  return Math.min(Math.max(num, min), max);
}

export function memoizeArgs(fn) {
  let lastArgument;

  return function(argument) {
    if(typeof lastArgument === 'undefined' || lastArgument !== argument) {
      fn(argument);
    }
    lastArgument = argument;
  };
}

export function degrees(rad) {
  return rad / (Math.PI / 180);
}

export function getId() {
  const storedId = window.localStorage.getItem('playerId');

  if(storedId) {
    return storedId;
  }

  const id = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);

  window.localStorage.setItem('playerId', id);

  return id;
}

export function createCollisionDispatcher(collisionHandlers) {
  return function handleCollisions(world) {
    for(let {bodyA, bodyB} of world.impacts) {
      if(this.body === bodyA || this.body === bodyB) {
        const other = this.body === bodyA ? bodyB : bodyA;
        const handler = collisionHandlers.get(other.TYPE);
        return handler(this);
      }
    }
    return this;
  };
}

export {radians as radians};
