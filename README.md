# musictime

Small class to work with timings in a musical context. They are defined as bars/beats/sixteenths, and can be converted to and from actual time in seconds.


```
const t1 = new MusicTime(0,0,0);            // constructor accepts bars, beats, sixteenths (all 0-based)
const t2 = MusicTime.fromString('1.2.3');   // parsing from a string can make data with a lot of timings much cleaner
const t3 = MusicTime.fromTime(10, 120);     // creates an instance at 10s (at 120bpm)
const t4 = t1.add(t2);                      // adds two times
const s = t4.toTime(120);                   // converts to seconds (at 120bpm)

```

### beatsPerBar and sixteenthsPerBeat
Both values default to 4, but can be overridden in the constructor (4th and 5th parameter, respectively)

```
// constructor accepts bars, beats, sixteenths 
const t1 = new MusicTime(1,2,3,3,8);        // 3 beats per bar, 8 sixteenths per beat   
```


### limitations
- there is currently nothing more than the sixteenth grid (although the sixteenthsPerBeat can be adjusted)
- conversions from a time in seconds will floor to that grid and discard any remaining timeinfo
- timings with unequal beatsPerBar and sixteenthsPerBeat settings cannot be summed or subtracted


