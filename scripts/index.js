import {World} from 'p2';
import {render} from 'render';
import {contactMaterials} from 'materials';
import {playSounds} from 'sounds';
import gameLoop from 'gameLoop';
import throttle from 'lodash.throttle';
import extend from 'extend';
import omit from 'lodash.omit';
import network from 'network';

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

const id = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);

const update = throttle(function update(st) {
  network.emit('update', extend({}, st.player, {
    body: omit(st.player.body, ['world', 'shapes']),
    id
  }));
}, 10);


gameLoop(function(input) {

  const world = updateWorld(state.world, input);
  const player = updatePlayer(state.player, input);
  const planes = updatePlanes(state.planes, input, world);
  const bullets = updateBullets(state.bullets, input, world, player);
  const crates = updateCrates(state.crates, input);
  const explosions = updateExplosions(state.explosions, input, bullets);

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
  update(state);
});

