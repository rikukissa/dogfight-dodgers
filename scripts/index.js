import {World} from 'p2';
import {render} from 'render';
import {contactMaterials} from 'materials';
import {playSounds} from 'sounds';
import gameLoop from 'gameLoop';
import extend from 'extend';
import omit from 'lodash.omit';
import * as input from 'input';
import * as network from 'network';

import {initial as initialWorld, update as updateWorld} from './world';
import {initial as initialPlayer, update as updatePlayer} from './player';
import {initial as initialPlanes, update as updatePlanes} from './plane';
import {initial as initialBullets, update as updateBullets} from './bullet';
import {initial as initialCrates, update as updateCrates} from './crate';
import {initial as initialExplosions, update as updateExplosions} from './explosion';

const engine = new World({
  gravity: [0, -9.82]
});

contactMaterials.forEach(material => engine.addContactMaterial(material));

let state = {
  world: initialWorld(engine),
  player: initialPlayer(engine),
  bullets: initialBullets(engine),
  crates: initialCrates(engine),
  explosions: initialExplosions(engine),
  planes: initialPlanes(engine)
};


function sendUpdate(st) {
  const body = omit(st.player.body, ['world', 'shapes']);
  const playerData = extend({}, st.player, {body});
  network.update(playerData);
}

gameLoop(function(delta) {

  const inputState = input.getState();
  const networkState = network.getState();

  inputState.delta = delta.delta;
  inputState.planes = networkState.planes;

  input.flush();
  network.flush();

  const world = updateWorld(state.world, inputState);
  const player = updatePlayer(state.player, inputState);
  const planes = updatePlanes(state.planes, inputState, world);
  const bullets = updateBullets(state.bullets, inputState, world, player);
  const crates = updateCrates(state.crates, inputState);
  const explosions = updateExplosions(state.explosions, inputState, bullets);

  state = {
    world,
    player,
    planes,
    bullets,
    crates,
    explosions
  };

  render(state);
  playSounds(state);

  sendUpdate(state);
});

