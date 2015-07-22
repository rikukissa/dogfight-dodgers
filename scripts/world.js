export const WIDTH = 1000;
export const HEIGHT = 100;
export const GROUND_LEVEL = 0;

export const CRATE_WIDTH = 1;

export const initial = {
  crates: [
    {position: {x: 10, y: GROUND_LEVEL}},
    {position: {x: 11, y: GROUND_LEVEL}},
    {position: {x: 12, y: GROUND_LEVEL}},
    {position: {x: 11, y: GROUND_LEVEL + 1}},
    {position: {x: 25, y: GROUND_LEVEL}},
    {position: {x: 26, y: GROUND_LEVEL}},
    {position: {x: 45, y: GROUND_LEVEL}}
  ],
  sounds: {}
};

export function update(world) {
  return world;
}

require('hotReplaceNotifier')();
