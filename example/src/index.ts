import MusicTime from '../../src/lib/MusicTime';

['1.0.0', '1.2.3', '1.4.0', '21.0.12'].forEach(entry => {
  const time = MusicTime.fromString(entry);
  console.log(entry, time.getBarsBeatsSixteenths(), time.getTotalBeats(), time.toString());
});


const t1 = new MusicTime(0,8,0.5);


// expect(new MusicTime(0,8,0).add(new MusicTime(0,0,17)).toString()).to.equal('3.0.1');
const button  = window['start'];
const textEl = window['text'];

let isRunning = false;
let startTime = 0;
button.addEventListener('click', () => {
  if (!isRunning) {
    isRunning = true;
    startTime = Date.now();
    render();
  } else {
    isRunning = false;
  }

});


const render = () => {
  const time = (Date.now() - startTime) / 1000;
  const musicTime = MusicTime.fromTime(time, 70)
  textEl.innerHTML = `${time.toFixed(2)}<br> ${musicTime.toString()}`;
  if (isRunning) {
    requestAnimationFrame(render);
  }
};
