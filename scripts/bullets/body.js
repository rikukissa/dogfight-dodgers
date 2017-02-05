import p2 from 'p2';
import {WIDTH, HEIGHT, TYPE} from './';
import {PLANE_WIDTH} from 'plane';

export default function create(bullet) {
  const body = new p2.Body(bullet.body);

  body.addShape(new p2.Box({
    width: WIDTH,
    height: HEIGHT
  }));

  return body;
}

export function update(engine, prevState, state) {

  if(state.bullets.length > prevState.bullets.length) {
    engine.addBody(create(state.bullets[0]));
  }

  return state.bullets;
}