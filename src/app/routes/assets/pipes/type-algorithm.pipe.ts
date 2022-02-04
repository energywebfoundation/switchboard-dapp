import { Pipe, PipeTransform } from '@angular/core';
import { KeyTypesEnum } from '../models/keyTypesEnum';

@Pipe({
  name: 'typeAlgorithm',
})
export class TypeAlgorithmPipe implements PipeTransform {
  transform(value: string): unknown {
    if (!value) {
      return '';
    }

    const result = this.getListOfKeys(value).join(' / ');

    return result.length > 0 ? result : value;
  }

  getListOfKeys(value: string): string[] {
    return Object.entries(KeyTypesEnum)
      .filter((entry) => value.includes(entry[1]))
      .map((entry) => entry[0]);
  }
}
