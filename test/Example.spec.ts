import {expect} from 'chai';
import MusicTime from "../src/lib/MusicTime";

let musicTime:MusicTime;

describe('MusicTime', () => {
  beforeEach(() => {
    musicTime = new MusicTime(0,0,0);
  });

  it('should not normalize bars', () => {
    expect(new MusicTime(20,0,0).toString()).to.equal('20.0.0');
  });

  it('should normalize beats', () => {
    expect(new MusicTime(0,16,0).toString()).to.equal('4.0.0');
  });

  it('should normalize sixteenths', () => {
    expect(new MusicTime(0,0,27).toString()).to.equal('1.2.3');
  });

  it('should convert to seconds', () => {
    expect(new MusicTime(0,120,0).toTime(120)).to.equal(60);
  });

  it('should convert from seconds', () => {
    expect(MusicTime.fromTime(1, 120).toString()).to.equal('0.2.0');
  });

  it('should add two compatible times', () => {
    expect(new MusicTime(0,8,0).add(new MusicTime(0,0,17)).toString()).to.equal('3.0.1');
  });

  it('should multiply a time', () => {
    expect(new MusicTime(0,8,0).multiply(4).toString()).to.equal('8.0.0');
  });

  it('should subtract two compatible times', () => {
    expect(new MusicTime(0,8,0).subtract(new MusicTime(1,0,0)).toString()).to.equal('1.0.0');
  });

  it('should fail when adding two incompatible times', () => {
    expect(() => {
      new MusicTime(0,1,0,3).add(new MusicTime(0,1,0)).toString()
    }).to.throw();
  });

  it('should check equality', () => {
    expect(new MusicTime(0,8,0).equals(new MusicTime(2,0,0))).to.equal(true);
  });

  it('should convert to sixteenths', () => {
    expect(new MusicTime(1,0,0).toSixteenths()).to.equal(16);
  });

  it('should convert to full bars', () => {
    expect(new MusicTime(0,0,16).toBarsFloat()).to.equal(1);
  });

  it('should convert to partial bars', () => {
    expect(new MusicTime(0,0,8).toBarsFloat()).to.equal(0.5);
  });

  it('should convert to full beats', () => {
    expect(new MusicTime(0,0,4).toBeatsFloat()).to.equal(1);
  });

  it('should convert to partial beats', () => {
    expect(new MusicTime(0,0,2).toBeatsFloat()).to.equal(0.5);
  });

  it('should clone', () => {
    const time = new MusicTime(11,13,58);
    const clone = time.clone();
    expect(time.equals(clone)).to.equal(true);
  });

  it('should convert from valid string', () => {
    expect(MusicTime.fromString('1.2.3').toString()).to.equal('1.2.3');
  });

  it('should fail on invalid string', () => {
    expect(() => {
      MusicTime.fromString('invalid')
    }).to.throw();
  });
});
