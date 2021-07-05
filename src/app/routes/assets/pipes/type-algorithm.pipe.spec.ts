import { TypeAlgorithmPipe } from './type-algorithm.pipe';
import { AlgorithmsEnum } from '../models/algorithms.enum';

describe('TypeAlgorithmPipe', () => {
  let pipe;

  beforeEach(() => {
    pipe = new TypeAlgorithmPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return the same value when not exist in algorithms enum', () => {
    const sampleText = 'sample';
    expect(pipe.transform(sampleText)).toBe(sampleText);
  });

  it('should return empty string when gets null', () => {
    expect(pipe.transform(null)).toBe('');
  });

  it('should return ethereum or bitcoin when gets Secp256k1', () => {
    const text = AlgorithmsEnum.Ethereum;
    expect(pipe.transform(text)).toBe('Ethereum / Bitcoin');
  });

  it('should return ethereum or bitcoin when string contains Secp256k1', () => {
    const text = 'text' + AlgorithmsEnum.Ethereum + 'text';
    expect(pipe.transform(text)).toBe('Ethereum / Bitcoin');
  });

  it('extend algorithms enum and check if displays without /', () => {
    (AlgorithmsEnum as any).Test  = 'test';
    const text = (AlgorithmsEnum as any).Test;
    expect(pipe.transform(text)).toBe('Test');
  })
});
