import { Pipe, PipeTransform } from '@angular/core';
import { AlgorithmsEnum } from '../models/algorithms.enum';

@Pipe({
  name: 'typeAlgorithm'
})
export class TypeAlgorithmPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    if (!value) {
      return '';
    }

    const result = Object.entries(AlgorithmsEnum).filter((entry) => {
      if (value.includes(entry[1])) {
        return entry[0];
      }
    }).map(entry => entry[0]).join(' / ');

    return result.length > 0 ? result : value;
  }

  getIndex(value) {
    return Object.values(AlgorithmsEnum).findIndex((algVal) => value.includes(algVal));
  }

  getKeys(id) {
    return Object.keys(AlgorithmsEnum)[id];
  }

}
