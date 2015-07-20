import extend from 'deep-extend';

export const WIDTH = 1000;
export const HEIGHT = 100;
export const GROUND_LEVEL = 1;

export const initial = {
  dangerZone: false,
  sounds: {
    dangerZone: false,
    endDangerZone: false
  }
};

export function update(world, [player, input]) {
  const newWorld = extend({}, world);


  newWorld.dangerZone = player.position.x < 0 || player.position.x > WIDTH;


  newWorld.sounds = {
    dangerZone: false,
    endDangerZone: false
  }

  if(!world.dangerZone && newWorld.dangerZone) {
    newWorld.sounds.dangerZone = true;
  }

  if(world.dangerZone && !newWorld.dangerZone) {
    newWorld.sounds.endDangerZone = true;
  }

  return newWorld;
}

require('./hotReplaceNotifier')();
