import p2 from 'p2';
import {GROUND_LEVEL} from 'world';

export const WIDTH = 1.6;
export const HEIGHT = 1;


function updatePlane(plane, newPlane) {
  plane.body.position[0] = newPlane.body.position[0];
  plane.body.position[1] = newPlane.body.position[1];
  plane.body.angle = newPlane.body.angle;
}

export function create(opts, world) {
  const body = new p2.Body({
    mass: 0,
    angle: 0,
    position: [3, GROUND_LEVEL + HEIGHT / 2]
  });

  world.addBody(body);

  body.addShape(new p2.Box({
    width: WIDTH,
    height: HEIGHT
  }));

  const plane = {
    body: body,
    thrust: 0,
    throttle: 0,
    healt: 1
  };

  if(!opts) {
    return plane;
  }

  updatePlane(plane, opts);

  return plane;
}

export const initial = () => ({});

export function update(planes, input, world) {
  for(let id in input.planes) {
    const plane = planes[id];

    if(!plane) {
      planes[id] = create(input.planes[id], world);
      continue;
    }

    updatePlane(plane, input.planes[id]);
  }
  return planes;
}
