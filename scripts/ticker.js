import AnimationFrame from 'animation-frame';
import {FRAME_RATE, WORLD_SPEED} from 'constants';
import { Observable } from 'rxjs';
import requestAnimationFrame from 'rxjs/scheduler/animationFrame';

export default Observable.interval(requestAnimationFrame).scan(function timeDelta({ lastTime }) {
// export default Observable.interval(1000 / 10).scan(function timeDelta({ lastTime }) {
  const current = Date.now();
  const difference = current - lastTime;

  return {
    lastTime: current,
    difference,
    delta: difference / (WORLD_SPEED * 1000)
  };
}, {
  lastTime: Date.now()
})