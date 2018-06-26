// interface ITimeConfig {
//   beatsPerBar: number;
//   sixteenthsPerBeat: number;
// }

interface IBarsBeatsSixteenths {
  bars: number;
  beats: number;
  sixteenths: number;
  remainingBars: number;
}

export default class MusicTime {
  public beatsPerBar: number;
  public sixteenthsPerBeat: number;
  private _beats: number;

  constructor(
    bars: number = 0,
    beats: number = 0,
    sixteenths: number = 0,
    beatsPerBar: number = 4,
    sixteenthsPerBeat: number = 4,
  ) {
    this.beatsPerBar = beatsPerBar;
    this.sixteenthsPerBeat = sixteenthsPerBeat;
    this._beats = bars * beatsPerBar + beats + sixteenths / sixteenthsPerBeat;
  }

  /**
   *
   * @returns {IBarsBeatsSixteenths}
   */
  public getBarsBeatsSixteenths(): IBarsBeatsSixteenths {
    const totalSixteenths = Math.floor(this._beats * this.sixteenthsPerBeat);
    const sixteenthsPerBar = this.sixteenthsPerBeat * this.beatsPerBar;
    const bars = Math.floor(totalSixteenths / sixteenthsPerBar);
    const beats = Math.floor((totalSixteenths - bars * sixteenthsPerBar) / this.sixteenthsPerBeat);

    return {
      bars,
      beats,
      sixteenths: totalSixteenths - bars * sixteenthsPerBar - beats * this.sixteenthsPerBeat,
      remainingBars: 0,
    };
  }

  /**
   * Returns the time in seconds.
   * @param bpm
   * @returns {number}
   */
  public toTime(bpm: number): number {
    return this._beats * 60 / bpm;
  }

  /**
   * Adds a musicTime to the instance.
   * @param {MusicTime} time
   * @returns {MusicTime}
   */
  public add(time: MusicTime): MusicTime {
    return MusicTime.add(this, time);
  }

  /**
   * Subtracts a musicTime from the instance.
   * @param {MusicTime} time
   * @returns {MusicTime}
   */
  public subtract(time: MusicTime): MusicTime {
    return MusicTime.subtract(this, time);
  }

  /**
   * Multiplies a musicTime with a scalar.
   * @param {number} value
   * @returns {MusicTime}
   */
  public multiply(value: number): MusicTime {
    return MusicTime.multiply(this, value);
  }

  /**
   * Check if the instance is equal to another time.
   * @param {MusicTime} time
   * @returns {MusicTime}
   */
  public equals(time: MusicTime): boolean {
    return MusicTime.equals(this, time);
  }

  /**
   * Create a clone of the instance.
   * @returns {MusicTime}
   */
  public clone(): MusicTime {
    return new MusicTime(0, this._beats);
  }

  public getBars(): number {
    return this._beats / this.beatsPerBar;
  }

  public getBeats(): number {
    return this._beats;
  }

  public getSixteenths(): number {
    return this._beats * this.sixteenthsPerBeat;
  }

  /**
   * Returns a readable string.
   * @returns {string}
   */
  public toString(): string {
    const bbs = this.getBarsBeatsSixteenths();
    return `${bbs.bars}.${bbs.beats}.${bbs.sixteenths}`;
  }

  /**
   * Returns the amount of beats.
   * @returns {number}
   */
  public valueOf(): number {
    return this._beats;
  }

  /**
   * Subtracts two MusicTimes.
   * @param {MusicTime} time1
   * @param {MusicTime} time2
   * @returns {MusicTime}
   */
  public static subtract(time1: MusicTime, time2: MusicTime): MusicTime {
    this.throwErrorWhenIncompatible('subtract', time1, time2);
    return new MusicTime(0, time1._beats - time2._beats);
  }

  /**
   * Creates an instance from a string: '0.1.2'
   * @param value
   * @param beatsPerBar
   * @param sixteenthsPerBeat
   * @returns {MusicTime}
   */
  public static fromString(
    value: string,
    beatsPerBar: number = 4,
    sixteenthsPerBeat: number = 4,
  ): MusicTime {
    if (!MusicTime.stringIsValid(value)) {
      throw new Error('Invalid string');
    }
    const split: string[] = value.split('.');
    return new MusicTime(
      parseInt(split[0], 10),
      parseInt(split[1], 10),
      parseInt(split[2], 10),
      beatsPerBar,
      sixteenthsPerBeat,
    );
  }

  private static throwErrorWhenIncompatible(
    operation: string,
    time1: MusicTime,
    time2: MusicTime,
  ): void {
    if (
      time1.beatsPerBar !== time2.beatsPerBar ||
      time1.sixteenthsPerBeat !== time2.sixteenthsPerBeat
    ) {
      throw new Error(
        `Cannot ${operation} when beatsPerBar (${time1.beatsPerBar},${
          time2.beatsPerBar
        }) or sixteenthsPerBeat (${time1.sixteenthsPerBeat},${
          time2.sixteenthsPerBeat
        }) are not equal`,
      );
    }
  }

  /**
   * Returns the sum of two times.
   * @param {MusicTime} time1
   * @param {MusicTime} time2
   * @returns {MusicTime}
   */
  public static add(time1: MusicTime, time2: MusicTime): MusicTime {
    MusicTime.throwErrorWhenIncompatible('add', time1, time2);
    return new MusicTime(0, time1._beats + time2._beats);
  }

  /**
   * Check if two times are equal.
   * @param {MusicTime} time1
   * @param {MusicTime} time2
   * @returns {boolean}
   */
  public static equals(time1: MusicTime, time2: MusicTime): boolean {
    return time1._beats === time2._beats;
  }

  /**
   * Checks if a string can be used in MusicTime.fromString();
   * @param {string} value
   * @returns {boolean}
   */
  public static stringIsValid(value: string): boolean {
    const split = value.split('.');
    if (split.length !== 3) {
      return false;
    }

    // todo this can be optimized
    for (let i = 0; i < split.length; i++) {
      const entry = split[i];
      // check if every character is a number (otherwise '10test1.0.0' is valid)
      for (let char = 0; char < entry.length; char++) {
        if (!Number.isInteger(parseInt(entry.charAt(char), 10))) {
          return false;
        }
      }

      const parsedInt = parseInt(split[i], 10);
      if (!Number.isInteger(parsedInt) || parsedInt < 0) {
        return false;
      }
    }

    return true;
  }

  /**
   * Returns the multiplication of a times with a value.
   * @param {MusicTime} time
   * @param {number} value
   * @returns {MusicTime}
   */
  public static multiply(time: MusicTime, value: number): MusicTime {
    return new MusicTime(0, time._beats * value);
  }

  /**
   * Creates a MusicTime instance from an amount of seconds. Will be floored to the 16th grid,
   * remaining time will be thrown away.
   * @param {number} timeInSeconds
   * @param {number} bpm
   * @param {number} sixteenthsPerBeat
   * @returns {MusicTime}
   */
  public static fromTime(
    timeInSeconds: number,
    bpm: number,
    sixteenthsPerBeat: number = 4,
  ): MusicTime {
    const sixteenthsPerSecond: number = bpm * sixteenthsPerBeat / 60;
    const sixteenthsUnrounded: number = timeInSeconds * sixteenthsPerSecond;

    return new MusicTime(0, 0, Math.floor(sixteenthsUnrounded));
  }
}
