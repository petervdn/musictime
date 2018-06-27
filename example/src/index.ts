import MusicTime from '../../src/lib/MusicTime';

['1.0.0', '1.2.3', '1.4.0', '21.0.12'].forEach(entry => {
  const time = MusicTime.fromString(entry);
  console.log(entry, time.getBarsBeatsSixteenths(), time.getTotalBeats(), time.toString());
});

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
