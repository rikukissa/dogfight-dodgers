import AnimationFrame from 'animation-frame';
import {FRAME_RATE, WORLD_SPEED} from 'constants';

const deltaTime = (() => {
  let lastTime;

  return function timeDelta(timestamp) {
    const current = timestamp / 1000;

    lastTime = lastTime || current;
    const difference = current - lastTime;

    lastTime = current;

    return {
      current,
      difference,
      delta: difference / WORLD_SPEED
    };
  };
})();

const animationFrame = new AnimationFrame(FRAME_RATE);

export default function gameLoop(fn) {

  function loop(timestamp) {
    animationFrame.request(loop);
    return fn(deltaTime(timestamp));
  }

  loop(0);
}

