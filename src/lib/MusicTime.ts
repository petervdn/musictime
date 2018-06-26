interface ITimeConfig {
  beatsPerBar: number;
  sixteenthsPerBeat: number;
}

interface IBarsBeatsSixteenths {
  bars: number;
  beats: number;
  sixteenths: number;
  remainingSixteenths: number;
}

const getDefaultTimeConfig = () => ({
  sixteenthsPerBeat: 4,
  beatsPerBar: 4,
});

export const stringIsValid = (value: string) => {
  const split = value.split('.');
  if (split.length !== 3) {
    return false;
  }

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
};

export default class MusicTime {
  private _beats: number;
  private _timeConfig: ITimeConfig;

  constructor(
    bars: number = 0,
    beats: number = 0,
    sixteenths: number = 0,
    timeConfig?: ITimeConfig,
  ) {
    this._timeConfig = timeConfig || getDefaultTimeConfig();

    this._beats =
      bars * this._timeConfig.beatsPerBar + beats + sixteenths / this._timeConfig.sixteenthsPerBeat;
  }

  /**
   * Returns an object with bars, beats & sixteenths, based on the current timeConfig.
   * @returns {IBarsBeatsSixteenths}
   */
  public getBarsBeatsSixteenths(): IBarsBeatsSixteenths {
    const totalSixteenths = this._beats * this._timeConfig.sixteenthsPerBeat;
    const flooredSixteenths = Math.floor(totalSixteenths);
    const sixteenthsPerBar = this._timeConfig.sixteenthsPerBeat * this._timeConfig.beatsPerBar;
    const bars = Math.floor(flooredSixteenths / sixteenthsPerBar);
    const beats = Math.floor(
      (flooredSixteenths - bars * sixteenthsPerBar) / this._timeConfig.sixteenthsPerBeat,
    );

    return {
      bars,
      beats,
      sixteenths:
        flooredSixteenths - bars * sixteenthsPerBar - beats * this._timeConfig.sixteenthsPerBeat,
      remainingSixteenths: totalSixteenths - flooredSixteenths,
    };
  }

  /**
   * Returns the current timeConfig (beatsPerBar and sixteenthsPerBeat).
   * @returns {ITimeConfig}
   */
  public getTimeConfig(): ITimeConfig {
    return {
      sixteenthsPerBeat: this._timeConfig.sixteenthsPerBeat,
      beatsPerBar: this._timeConfig.beatsPerBar,
    };
  }

  /**
   * Set the timeConfig.
   * @param {ITimeConfig} value
   */
  public setTimeConfig(value: ITimeConfig): void {
    this._timeConfig = value;
  }

  /**
   * Convert to time in seconds, based on a given amount of beats per minute.
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

  public getTotalBars(): number {
    return this._beats / this._timeConfig.beatsPerBar;
  }

  public getTotalBeats(): number {
    return this._beats;
  }

  public getTotalSixteenths(): number {
    return this._beats * this._timeConfig.sixteenthsPerBeat;
  }

  /**
   * Returns a readable string.
   * @returns {string}
   */
  public toString(): string {
    const bbs = this.getBarsBeatsSixteenths();
    if (bbs.remainingSixteenths > 0) {
      return `${bbs.bars}.${bbs.beats}.${bbs.sixteenths} [${bbs.remainingSixteenths.toFixed(2)}]`;
    }
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
   * Subtracts two MusicTimes. The timeConfig of the first time will be used in the result.
   * @param {MusicTime} time1
   * @param {MusicTime} time2
   * @returns {MusicTime}
   */
  public static subtract(time1: MusicTime, time2: MusicTime): MusicTime {
    return new MusicTime(0, time1._beats - time2._beats, 0, time1.getTimeConfig());
  }

  /**
   * Returns the sum of two times. The timeConfig of the first time will be used in the result.
   * @param {MusicTime} time1
   * @param {MusicTime} time2
   * @returns {MusicTime}
   */
  public static add(time1: MusicTime, time2: MusicTime): MusicTime {
    return new MusicTime(0, time1._beats + time2._beats, 0, time1.getTimeConfig());
  }

  /**
   * Multiplies the time with a value. The time's timeConfig will be used in the result.
   * @param {MusicTime} time
   * @param {number} value
   * @returns {MusicTime}
   */
  public static multiply(time: MusicTime, value: number): MusicTime {
    return new MusicTime(0, time._beats * value, 0, time.getTimeConfig());
  }

  /**
   * Creates an instance from a string: '0.1.2'
   * @param value
   * @param timeConfig
   * @returns {MusicTime}
   */
  public static fromString(value: string, timeConfig?: ITimeConfig): MusicTime {
    if (!stringIsValid(value)) {
      throw new Error('Invalid string');
    }
    const split: string[] = value.split('.');
    return new MusicTime(
      parseInt(split[0], 10),
      parseInt(split[1], 10),
      parseInt(split[2], 10),
      timeConfig,
    );
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
   * Creates a MusicTime instance from an amount of seconds.
   * @param {number} seconds
   * @param {number} bpm
   * @param {ITimeConfig} timeConfig
   * @returns {MusicTime}
   */
  public static fromTime(seconds: number, bpm: number, timeConfig?: ITimeConfig): MusicTime {
    return new MusicTime(0, seconds * bpm / 60, 0, timeConfig);
  }
}
