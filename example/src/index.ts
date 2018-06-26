import MusicTime from '../../src/lib/MusicTime';

['1.0.0', '1.2.3', '1.4.0', '21.0.12'].forEach(entry => {
  const time = MusicTime.fromString(entry);
  console.log(entry, time.getBarsBeatsSixteenths(), time.getTotalBeats(), time.toString());
});


const t1 = new MusicTime(0,8,0.5);


// expect(new MusicTime(0,8,0).add(new MusicTime(0,0,17)).toString()).to.equal('3.0.1');
console.log(t1.getBarsBeatsSixteenths());

