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

  it('should return ethereum when gets Secp256k1', () => {
    const text = AlgorithmsEnum.Ethereum;
    expect(pipe.transform(text)).toBe('Ethereum');
  });

  it('should return ethereum when string contains Secp256k1', () => {
    const text = 'text' + AlgorithmsEnum.Ethereum + 'text';
    expect(pipe.transform(text)).toBe('Ethereum');
  });
});
