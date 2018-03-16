export default class MusicTime {
  public beatsPerBar: number;
  public sixteenthsPerBeat: number;
  public beats: number;
  public bars: number;
  public sixteenths: number;

  constructor(
    bars: number,
    beats: number,
    sixteenths: number,
    beatsPerBar: number = 4,
    sixteenthsPerBeat: number = 4,
  ) {
    this.bars = bars;
    this.beats = beats;
    this.sixteenths = sixteenths;
    this.beatsPerBar = beatsPerBar;
    this.sixteenthsPerBeat = sixteenthsPerBeat;

    this.normalize();
  }

  /**
   * Returns the time in seconds.
   * @param bpm
   * @returns {number}
   */
  public toTime(bpm: number): number {
    const beats =
      this.bars * this.beatsPerBar + this.beats + this.sixteenths / this.sixteenthsPerBeat;

    return beats * 60 / bpm;
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
   * Makes sure the beats don't exceed the beatsPerbar, and the sixteenths don't exceed sixteenthsPerBeat.
   */
  private normalize(): void {
    const sixteenths = this.sixteenths % this.sixteenthsPerBeat;
    const beatsFromSixteenths = Math.floor(this.sixteenths / this.sixteenthsPerBeat);

    const beats = (this.beats + beatsFromSixteenths) % this.beatsPerBar;
    const barsFromBeats = Math.floor((this.beats + beatsFromSixteenths) / this.beatsPerBar);

    const bars = this.bars + barsFromBeats;

    this.sixteenths = sixteenths;
    this.beats = beats;
    this.bars = bars;
  }

  /**
   * Create a clone of the instance.
   * @returns {MusicTime}
   */
  public clone(): MusicTime {
    return new MusicTime(
      this.bars,
      this.beats,
      this.sixteenths,
      this.beatsPerBar,
      this.sixteenthsPerBeat,
    );
  }

  /**
   * Gets the amount of sixteenths (will always be an integer since 16ths is the smallest grid)
   * @returns {number}
   */
  public toSixteenths(): number {
    return (
      this.sixteenths +
      this.sixteenthsPerBeat * this.beats +
      this.sixteenthsPerBeat * this.beatsPerBar * this.bars
    );
  }

  /**
   * Gets the amount of bars (can be float)
   * @returns {number}
   */
  public toBarsFloat(): number {
    return (
      this.bars +
      this.beats / this.beatsPerBar +
      this.sixteenths / this.sixteenthsPerBeat / this.beatsPerBar
    );
  }

  /**
   * Gets the amount of bars (can be float)
   * @returns {number}
   */
  public toBeatsFloat(): number {
    return this.bars * this.beatsPerBar + this.beats + this.sixteenths / this.sixteenthsPerBeat;
  }

  public toString(): string {
    return this.bars + '.' + this.beats + '.' + this.sixteenths;
  }

  /**
   * Subtracts two MusicTimes.
   * @param {MusicTime} time1
   * @param {MusicTime} time2
   * @returns {MusicTime}
   */
  public static subtract(time1: MusicTime, time2: MusicTime): MusicTime {
    this.throwErrorWhenIncompatible('subtract', time1, time2);
    return new MusicTime(0, 0, time1.toSixteenths() - time2.toSixteenths());
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
    const split: string[] = value.split('.');

    if (split.length !== 3) {
      // todo add more validation
      throw new Error('Invalid string');
    }
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

    return new MusicTime(
      time1.bars + time2.bars,
      time1.beats + time2.beats,
      time1.sixteenths + time2.sixteenths,
    ); // todo fix with toValue(), like the other operations
  }

  /**
   * Check if two times are equal.
   * @param {MusicTime} time1
   * @param {MusicTime} time2
   * @returns {boolean}
   */
  public static equals(time1: MusicTime, time2: MusicTime): boolean {
    return (
      time1.beatsPerBar === time2.beatsPerBar &&
      time1.sixteenthsPerBeat === time2.sixteenthsPerBeat &&
      time1.bars === time2.bars &&
      time1.beats === time2.beats &&
      time1.sixteenths === time2.sixteenths
    );
  }

  /**
   * Returns the multiplication of a times with a value.
   * @param {MusicTime} time
   * @param {number} value
   * @returns {MusicTime}
   */
  public static multiply(time: MusicTime, value: number): MusicTime {
    return new MusicTime(0, 0, time.toSixteenths() * value);
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
