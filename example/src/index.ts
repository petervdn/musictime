import MusicTime from '../../src/lib/MusicTime';

const button  = window['start'];
const seconds = window['seconds'];
const mt = window['mt'];
const totalBars = window['totalBars'];
const totalBeats = window['totalBeats'];
const totalSixteenths = window['totalSixteenths'];

let isRunning = false;
let startTime = 0;
button.addEventListener('click', () => {
  if (!isRunning) {
    isRunning = true;
    startTime = performance.now();
    render();
  } else {
    isRunning = false;
  }
});

const render = () => {
  const time = (performance.now() - startTime) / 1000;
  const musicTime = MusicTime.fromTime(time, 70);
  seconds.innerHTML = time;
  mt.innerHTML = musicTime.toString();
  totalBars.innerHTML = musicTime.getTotalBars();
  totalBeats.innerHTML = musicTime.getTotalBeats();
  totalSixteenths.innerHTML = musicTime.getTotalSixteenths();

  if (isRunning) {
    requestAnimationFrame(render);
  }
};
