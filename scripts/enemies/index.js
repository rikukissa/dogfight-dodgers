import { create, update as updatePlane } from 'plane';
import {WORLD_SPEED} from 'constants';
import {
  PLAYER_JOINED,
  PLAYER_UPDATE,
  PLAYER_LEFT
} from 'network/actions';
import { getDelta } from 'utils';

export function update(state, actions, delta) {

  const newEnemies = actions
    .filter(({type}) => type === PLAYER_JOINED)
    .map(({payload}) => create(payload));

  const updatedEnemies = actions
    .filter(({type}) => type === PLAYER_UPDATE)
    .map(({payload}) => {
      const totalDelta = delta + getDelta(state.currentTime, payload.currentTime);
      return updatePlane(create(payload.player), totalDelta);
    });

  const disconnectedEnemyIds = actions
    .filter(({type}) => type === PLAYER_LEFT)
    .map(({payload}) => payload.id)

  const existingEnemies = state.enemies.filter(({id}) =>
    disconnectedEnemyIds.indexOf(id) === -1
  ).map((enemy) => {
    for(const updatedEnemy of updatedEnemies) {
      if(updatedEnemy.id === enemy.id) {
        return updatedEnemy;
      }
    }
    return enemy;
  });


  return existingEnemies
    .concat(newEnemies)
    .map((plane) => updatePlane(plane, delta));
}