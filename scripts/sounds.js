import audio from 'browser-audio';
import Bacon from 'baconjs';

const shootSound = audio.create(require('../assets/sounds/shot.mp3'));

const $mute = document.getElementById('mute');
$mute.checked = JSON.parse(window.localStorage.getItem('soundsMuted'));

export const muted$ = Bacon.fromEvent($mute, 'change')
  .map('.target')
  .map('.checked')
  .doAction((value) => {
    window.localStorage.setItem('soundsMuted', value);
  })
  .toProperty($mute.checked);

export function playSounds({bullets}) {
  bullets.sounds.created.forEach(() => shootSound.play());
}

require('hotReplaceNotifier')();
