import {Body, Box} from 'p2';

export const CRATE_SIZE = 1;
import {wood} from 'materials';

export function initial(world) {

  function box(x, y) {

    const body = new Body({
      mass: 1,
      position: [x, y]
    });

    const shape = new Box({
      width: CRATE_SIZE,
      height: CRATE_SIZE,
      material: wood
    });

    body.addShape(shape);
    world.addBody(body);

    return body;
  }

  const crates = [
    {body: box(10, CRATE_SIZE / 2)},
    {body: box(11, CRATE_SIZE / 2)},
    {body: box(12, CRATE_SIZE / 2)},
    {body: box(12 - CRATE_SIZE / 2, CRATE_SIZE / 2 + CRATE_SIZE)},
    {body: box(11 - CRATE_SIZE / 2, CRATE_SIZE / 2 + CRATE_SIZE)},
    {body: box(11, CRATE_SIZE / 2 + CRATE_SIZE * 2)}
  ];

  return {
    crates,
    sounds: {}
  };
}

export function update(crates) {
  return crates;
}
