import audio from 'browser-audio';
const shootSound = audio.create(require('../assets/sounds/shot.mp3'));


let lastBullets = 0;

export function playSounds({bullets}) {
  bullets.sounds.created.forEach(() => shootSound.play());
}

require('./hotReplaceNotifier')();
