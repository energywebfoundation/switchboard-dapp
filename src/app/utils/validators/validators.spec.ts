import { FormControl } from '@angular/forms';
import { listContainsValidator } from './list-contains.validator';

const hexCode =
  '0x8C2CBcBE93b96ef66F854407548edE5f74f4c016ybdybdjdbdjdyydydjdjdjdjdd';

describe('listContainsValidators', () => {
  it('listContainsValidator should not return null if it fails', () => {
    const source = [
      {
        publicKeyHex:
          '0x8C2CBcBE93b96ef66F854407548edE5f74f4c016ybdybdjdbdjdyydydjdjdjdjdd',
      },
    ];

    const validator = listContainsValidator(source, 'publicKeyHex');
    const exists = validator(new FormControl(hexCode));

    expect(exists).not.toEqual(null);
  });

  it('listContainsValidator should return null if it passes', () => {
    const validator = listContainsValidator([], 'publicKeyHex');
    const exists = validator(new FormControl(hexCode));

    expect(exists).toEqual(null);
  });

  it('listContainsValidator should return null if source is undefined', () => {
    const validator = listContainsValidator(undefined, 'publicKeyHex');
    const exists = validator(new FormControl(hexCode));

    expect(exists).toEqual(null);
  });

  it('listContainsValidator should return null if property is undefined', () => {
    const validator = listContainsValidator([], undefined);
    const exists = validator(new FormControl(hexCode));

    expect(exists).toEqual(null);
  });
});
