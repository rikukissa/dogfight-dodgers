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

const soundBus$ = new Bacon.Bus();

soundBus$.filter(muted$.not()).onValue(({bullets}) => {
  bullets.sounds.created.forEach(() => shootSound.play());
});

export const playSounds = ::soundBus$.push;


