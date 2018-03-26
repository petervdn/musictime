# musictime

Small class to work with timings in a musical context. They are defined as bars/beats/sixteenths, and can be converted to and from actual time in seconds (by supplying a bpm).

### install

```sh
npm install musictime
```

## creating an instance
There are a few ways to create a `MusicTime` instance:
```javascript
import MusicTime from 'musictime';

const t1 = new MusicTime(0,0,0);            // constructor accepts bars, beats, sixteenths (all 0-based)
const t2 = MusicTime.fromString('1.2.3');   // parsing from a string can make data with a lot of timings much cleaner
const t3 = MusicTime.fromTime(10, 120);     // creates an instance at 10s (at 120bpm)
```

Note that all times will be normalized:
```javascript
new MusicTime(0,0,16); // will have 1 bar, 0 beats, 0 sixteenths
```

## some operations
```javascript
// calculations
const result1 = t1.add(t2);
const result2 = t2.subtract(t1);
const result3 = t2.multiply(3);

// these are also available as static methods
const result4 = MusicTime.add(t1, t2);
const result5 = MusicTime.subtract(t2, t1);
const result6 = MusicTime.multiply(t2, 3);

const clone = result1.clone();    // clones the instance
new MusicTime(1,2,3).toString();  // "1.2.3"
```

## converting to seconds
Supply a bpm to convert an instance to seconds.
```javascript
new MusicTime(0,120,0).toTime(120); // = 60
```

Results from these `toTime` calls will be stored in a cache, so that multiple requests (with the same bpm) will skip unnessesary calculations. This cache is global and is used by all `MusicTime` instances. If for some reason you want to clear this cache:
```javascript
MusicTime.clearCache();
```

## beatsPerBar and sixteenthsPerBeat
Both values default to 4, but can be overridden in the constructor (4th and 5th parameter, respectively)

```javascript
const t1 = new MusicTime(1,2,3,3,8);        // 3 beats per bar, 8 sixteenths per beat
```


## limitations
- there is currently nothing more than the sixteenth grid (although the `sixteenthsPerBeat` can be adjusted)
- conversions from a time in seconds will floor to that grid and discard any remaining timeinfo
- timings with unequal `beatsPerBar` and `sixteenthsPerBeat` settings cannot be summed or subtracted
- anything regarding negative numbers and timings is untested and will probably lead to incorrect results.

