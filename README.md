# musictime

A class that helps with timings in a musical context. Instances are defined on a grid of [bars](https://en.wikipedia.org/wiki/Bar_(music)), [beats](https://en.wikipedia.org/wiki/Beat_(music)) and [sixteenths](https://en.wikipedia.org/wiki/Sixteenth_note) and can be converted to and from actual time in seconds.

## install

```sh
npm install musictime
```

## creating an instance
There are a few ways to create a `MusicTime` instance:
```javascript
import MusicTime from 'musictime';

// constructor accepts bars, beats, sixteenths
const t1 = new MusicTime(1, 2, 3);

// all params default to 0
const t3 = new MusicTime(2);

// parse from a string
const t2 = MusicTime.fromString('1.2.3');

// creates an instance at 10s (at 120bpm)
const t5 = MusicTime.fromTime(10, 120);
```

Note that `bars`, `beats` and `sixteenths` all start at 0. This might be slightly counterintuitive from a musical perspective (counting 0,1,2,3 instead of 1,2,3,4).

## converting to seconds
The most common thing to do with a `MusicTime` instance is converting to seconds. You can do this by supplying the tempo in beats per minute (BPM):
```javascript
new MusicTime(0,120,0).toTime(120);
// result = 60
```


## bars, beats, sixteenths grid

Every `MusicTime` instance ends up on the bars/beats/sixteenths grid, which can be seen using the `getBarsBeatsSixteenths` method. In the resulting object, all these three values will be integers, any remaining time (when a time can not be placed exactly on the grid) can be found in the `remainingSixteenths` property (defined as a factor of sixteenths, which obviously can be a float).
```javascript
new MusicTime(1, 0, 0).getBarsBeatsSixteenths();
// {bars: 1, beats: 0, sixteenths: 0, remainingSixteenths: 0}
```


By default, 1 `bar` consists of 4 `beats`, and 1 `beat` consists of 4 `sixteenths`.
```javascript
// all values are normalized, so 16 sixteenths make up 1 bar
new MusicTime(0, 0, 16).getBarsBeatsSixteenths();
// {bars: 1, beats: 0, sixteenths: 0, remainingSixteenths: 0}

new MusicTime(0, 0, 23).getBarsBeatsSixteenths();
// {bars: 1, beats: 2, sixteenths: 3, remainingSixteenths: 0}
```

If you want to change how many beats go in a bar and/or how many sixteenths in a beat, you can pass that info in the constructor:
```javascript
new MusicTime(0, 3, 0, {sixteenthsPerBeat: 4, beatsPerBar: 3}).getBarsBeatsSixteenths();
// {bars: 1, beats: 0, sixteenths: 0, remainingSixteenths: 0}
```

You are allowed to use floats for the `bars`, `beats` or `sixteenths` values:
```javascript
new MusicTime(0.5, 0, 0).getBarsBeatsSixteenths();
// {bars: 0, beats: 2, sixteenths: 0, remainingSixteenths: 0}

new MusicTime(0, 0.5, 0).getBarsBeatsSixteenths();
// {bars: 0, beats: 0, sixteenths: 2, remainingSixteenths: 0}

new MusicTime(0, 0, 1.5).getBarsBeatsSixteenths();
// {bars: 0, beats: 0, sixteenths: 1, remainingSixteenths: 0.5}
```

(Floats are not allowed in strings that you pass to the `fromString` method. This will result in an error.)

## operations
```javascript
// calculations
const result1 = t1.add(t2);
const result2 = t2.subtract(t1);
const result3 = t2.multiply(3);

// also available as static methods
const result4 = MusicTime.add(t1, t2);
const result5 = MusicTime.subtract(t2, t1);
const result6 = MusicTime.multiply(t2, 3);

const clone = result1.clone();    // clones the instance
new MusicTime(1,2,3).toString();  // "1.2.3". note that this does not show the remainingSixteenths value
```

When adding or subtracting, the resulting (newly created) instance will use the `sixteenthsPerBeat` and `beatsPerBar` settings from the instance that comes first:
```javascript
// in both cases: result will have the settings from t1
const result = t1.add(t2);
const result = MusicTime.add(t1, t2);
```

## comparison
Instances have a `valueOf` method, which makes direct comparison through relational operators (`> < >= <=`) possible:
```javascript
const time1 = new MusicTime(1, 0, 0);
const time2 = new MusicTime(2, 0, 0);

time1 > time2 // true
time1 < time2 // false
```
Note that this does not affect checking equality (`==`, `===`, `!=`, `!==`).


## limitations
- anything regarding negative numbers and timings is untested and will probably lead to incorrect results.


## example usecase
Easily define timings for a [drumloop](https://makingmusic.ableton.com/programming-beats-2-linear-drumming-1.png) (the strings used are of the format `BARS . BEATS . SIXTEENTHS`)
```javascript
const kickTimings = ['0.0.0', '0.1.0', '0.2.0', '0.3.0'];
const snareTimings = ['0.1.0', '0.3.0'];
const hihatTimings = ['0.0.0', '0.0.2', '0.1.0', '0.1.2', '0.2.0', '0.2.2', '0.3.0', '0.3.2'];

const bpm = 120;

[...kickTimings, ...snareTimings, ...hihatTimings].forEach(timeString => {
  MusicTime.fromString(timeString).toTime(bpm); // gives time in seconds
});
```

