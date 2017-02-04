import audio from 'browser-audio';
import {Observable, Subject} from 'rxjs';

const shootSound = audio.create(require('../assets/sounds/shot.mp3'));

const $mute = document.getElementById('mute');
$mute.checked = JSON.parse(window.localStorage.getItem('soundsMuted'));

export const muted$ = Observable.fromEvent($mute, 'change')
  .map(({target}) => target.checked)
  .do((value) => {
    window.localStorage.setItem('soundsMuted', value);
  })
  .startWith($mute.checked);

const soundBus$ = new Subject();

muted$
.switchMap((muted) => muted ? Observable.never(): soundBus$)
.subscribe(({bullets}) => {
  bullets.sounds.created.forEach(() => shootSound.play());
});

export const playSounds = ::soundBus$.next;


