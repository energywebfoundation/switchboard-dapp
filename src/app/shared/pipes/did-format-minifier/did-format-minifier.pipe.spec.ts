import { DidFormatMinifierPipe } from './did-format-minifier.pipe';

describe('DidFormatMinifierPipe', () => {
  const pipe = new DidFormatMinifierPipe();
  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return undefined when value is undefined', () => {
    expect(pipe.transform(undefined)).toBeUndefined();
  });

  it('should minify passed did', () => {
    expect(pipe.transform('did:ethr:12345678901234567890')).toEqual(
      'did:ethr:123456...67890'
    );
  });
});
