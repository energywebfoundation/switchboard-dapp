import { DefaultValuePipe } from './default-value.pipe';

describe('DefaultValuePipe', () => {
  let pipe: DefaultValuePipe;

  beforeEach(() => {
    pipe = new DefaultValuePipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return value if it is not empty', () => {
    expect(pipe.transform('a')).toEqual('a');
  });

  it('should return default value if string is undefined', () => {
    expect(pipe.transform(undefined)).toEqual('None');
  });

  it('should return default value if string is empty string', () => {
    expect(pipe.transform('')).toEqual('None');
  });
});
