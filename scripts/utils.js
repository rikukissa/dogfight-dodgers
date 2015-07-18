import zipObject from 'lodash.zipobject';

export function randomGenerator(seed = 1) {
  return function() {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  }
}

export function random(randomFn, min, max) {
  return randomFn() * (max - min) + min;
}

export function toObject(...keys) {
  return function(...values) {
    return zipObject(keys, values);
  }
}

export function clamp(min, max, num) {
  return Math.min(Math.max(num, min), max);
};

export function image(src) {
  const img = new Image();
  img.src = src;
  return img;
}

export function memoizeArgs(fn) {
  let lastArgument;

  return function(argument) {
    if(typeof lastArgument === 'undefined' || lastArgument !== argument) {
      fn(argument);
    }
    lastArgument = argument;
  }
}
