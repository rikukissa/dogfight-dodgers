export const WIDTH = 1000;
export const HEIGHT = 100;
export const GROUND_LEVEL = 1;

export const CRATE_WIDTH = 1;

export const initial = {
  crates: [
    {
      position: {
        x: 10,
        y: GROUND_LEVEL
      }
    }
  ],
  sounds: {}
};

export function update(world) {
  return world;
}

require('hotReplaceNotifier')();
