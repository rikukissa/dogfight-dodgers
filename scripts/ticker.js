import AnimationFrame from 'animation-frame';
import {FRAME_RATE, WORLD_SPEED} from 'constants';
import { Observable } from 'rxjs';
import requestAnimationFrame from 'rxjs/scheduler/animationFrame';

export default Observable.interval(requestAnimationFrame).scan(function timeDelta({ currentTime }) {
// export default Observable.interval(1000 / 10).scan(function timeDelta({ currentTime }) {
  const current = Date.now();
  const difference = current - currentTime;

  return {
    currentTime: current,
    difference,
    delta: difference / (WORLD_SPEED * 1000)
  };
}, {
  currentTime: Date.now()
}).share();