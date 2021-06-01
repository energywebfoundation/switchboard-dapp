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
    const index = this.getIndex(value);
    return index < 0 ? value : this.getKeys(index);
  }

  getIndex(value) {
    return Object.values(AlgorithmsEnum).findIndex((algVal) => value.includes(algVal));
  }

  getKeys(id) {
    return Object.keys(AlgorithmsEnum)[id];
  }

}
