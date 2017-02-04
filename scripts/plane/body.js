import p2 from 'p2';
import {GROUND_LEVEL} from 'world';
import {WIDTH, HEIGHT, TYPE} from './';

export default function create() {
  const body = new p2.Body({
    mass: 0,
    angle: 0,
    position: [9, GROUND_LEVEL + HEIGHT / 2]
  });

  body.TYPE = TYPE;

  body.addShape(new p2.Box({
    width: WIDTH,
    height: HEIGHT
  }));

  return body;
}

export function update(body, {player}) {
  body.angle = player.body.angle;
  body.position = [...player.body.position];
  return body;
}