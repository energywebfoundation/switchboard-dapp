import { ReplaceUnderscorePipe } from './replace-underscore.pipe';

describe('ReplaceUnderscorePipe', () => {
  let pipe;

  beforeEach(() => {
    pipe = new ReplaceUnderscorePipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return same string if there is no underscore', () => {
    const text = 'sample text';
    expect(pipe.transform(text)).toBe(text);
  });

  it('should replace underscore with space', () => {
    const text = 'sample_text';
    expect(pipe.transform(text)).toBe('sample text');
  });

  it('should replace underscore with dash', () => {
    const text = 'sample_text';
    expect(pipe.transform(text, '-')).toBe('sample-text');
  });

  it('should return empty string if provided value is null', () => {
    expect(pipe.transform(null)).toBe('');
  });
});
