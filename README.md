# musictime

Small class to work with timings in a musical context. They are defined as bars/beats/sixteenths, and can be converted to and from actual time in seconds (by supplying a bpm).

### install

```sh
npm install musictime
```

### creating an instance
There are a few ways to create a MusicTime instance:
```javascript
const t1 = new MusicTime(0,0,0);            // constructor accepts bars, beats, sixteenths (all 0-based)
const t2 = MusicTime.fromString('1.2.3');   // parsing from a string can make data with a lot of timings much cleaner
const t3 = MusicTime.fromTime(10, 120);     // creates an instance at 10s (at 120bpm)
```

### some operations
MusicTime instances can be added, subtracted (both using another MusicTime) and multiplied (using a scalar)
```javascript
t1.add(t2);
t2.subtract(t1);
t2.multiply(3);

MusicTime.add(t1, t2); // also available as static methods
MusicTime.subtract(t2, t1);
MusicTime.multiply(t2, 3);
```

### converting to seconds
Supply a bpm to convert any MusicTime to seconds.
```javascript
new MusicTime(0,120,0).toTime(120); // = 60
```

### beatsPerBar and sixteenthsPerBeat
Both values default to 4, but can be overridden in the constructor (4th and 5th parameter, respectively)

```javascript
const t1 = new MusicTime(1,2,3,3,8);        // 3 beats per bar, 8 sixteenths per beat   
```


### limitations
- there is currently nothing more than the sixteenth grid (although the sixteenthsPerBeat can be adjusted)
- conversions from a time in seconds will floor to that grid and discard any remaining timeinfo
- timings with unequal beatsPerBar and sixteenthsPerBeat settings cannot be summed or subtracted


