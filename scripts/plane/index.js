import {GROUND_LEVEL} from 'world';

const TYPE = {};
export {TYPE as default};

export const WIDTH = 1.6;
export const HEIGHT = 1;


function updatePlane(plane, newPlane) {
  plane.body.position[0] = newPlane.body.position[0];
  plane.body.position[1] = newPlane.body.position[1];
  plane.body.angle = newPlane.body.angle;
}

export function create(opts, world) {

  const plane = {
    thrust: 0,
    throttle: 0,
    healt: 1,
    bullets: 20
  };

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
