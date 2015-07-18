import audio from 'browser-audio';
const shootSound = audio.create(require('../assets/sounds/shot.mp3'));
const dangerZone = audio.create(require('../assets/sounds/dangerzone.mp3'));


let lastBullets = 0;

export function playSounds({bullets, world}) {
  bullets.sounds.created.forEach(() => shootSound.play());

  if(world.sounds.dangerZone) {
    dangerZone.play()
  }
  if(world.sounds.endDangerZone) {
    dangerZone.stop()
  }
}

require('./hotReplaceNotifier')();
