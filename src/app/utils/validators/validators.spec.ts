import { FormControl } from '@angular/forms';
import { listContainsValidator } from './list-contains.validator';

describe('Validators', () => {
    describe('listContainsValidators', () => {
        it('listContainsValidator should not return null if it fails', () => {
            const source = [
                { publicKeyHex: '0x8C2CBcBE93b96ef66F854407548edE5f74f4c016ybdybdjdbdjdyydydjdjdjdjdd' }
            ]
            
            const validator = listContainsValidator(source, 'publicKeyHex');
            const exists = validator(new FormControl('0x8C2CBcBE93b96ef66F854407548edE5f74f4c016ybdybdjdbdjdyydydjdjdjdjdd'));
            
            expect(exists).not.toEqual(null);
        });

        it('listContainsValidator should return null if it passes', () => {
            
            const validator = listContainsValidator([], 'publicKeyHex');
            const exists = validator(new FormControl('0x8C2CBcBE93b96ef66F854407548edE5f74f4c016ybdybdjdbdjdyydydjdjdjdjdd'));
            
            expect(exists).toEqual(null);
        });
    })
});