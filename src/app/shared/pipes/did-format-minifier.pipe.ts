import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'didFormatMinifier'
})
export class DidFormatMinifierPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    let retVal = value;

    if (value && value.length > 10) {
      const lastColonIndex = value.lastIndexOf(':');
      retVal = `${value.substr(0, lastColonIndex + 7)}...${value.substr(value.length - 5)}`;
    }

    return retVal;
  }

}
