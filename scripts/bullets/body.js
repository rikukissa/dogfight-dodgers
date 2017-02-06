import p2 from 'p2';
import {WIDTH, HEIGHT} from './';
import {PLANE_WIDTH} from 'plane';

const TYPE = {};

export default function create(bullet) {

  const body = new p2.Body({id: bullet.id, type: TYPE, ...bullet.body});

  body.addShape(new p2.Box({
    width: WIDTH,
    height: HEIGHT
  }));

  return body;
}

export function update(engine, prevState, state) {

  const aliveBodies = engine.bodies.filter(body => body.type === TYPE);
  const aliveIds = aliveBodies.map(({id}) => id);
  const stateIds = state.bullets.map(({id}) => id);

  state.bullets.forEach((bullet) => {
    const index = aliveIds.indexOf(bullet.id);
    let body;
    if(index === -1) {
      body = create(bullet);
      engine.addBody(body);
    } else {
      body = aliveBodies[index];
    }
    body.position = [...bullet.body.position];
    body.angle = [...bullet.body.angle];
  });

  aliveBodies.forEach((body) => {
    if(stateIds.indexOf(body.id) === -1) {
      engine.removeBody(body);
    }
  });

  return state.bullets;
}