import audio from 'browser-audio';
const shootSound = audio.create(require('../assets/sounds/shot.mp3'));


let lastBullets = 0;

export function playSounds({bullets}) {
  if(bullets.length > lastBullets) {
    shootSound.play();
  }

  lastBullets = bullets.length;
}

require('./hotReplaceNotifier')();
