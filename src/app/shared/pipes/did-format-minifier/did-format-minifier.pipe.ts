import { Pipe, PipeTransform } from '@angular/core';

const CHARACTERS_AFTER_LAST_COLON = 7;
const LAST_CHARACTERS = 5;

@Pipe({
  name: 'didFormatMinifier',
})
export class DidFormatMinifierPipe implements PipeTransform {
  transform(value: string): string | undefined {
    if (!value) {
      return value;
    }

    const lastColonIndex = value.lastIndexOf(':');
    return `${value.substring(
      0,
      lastColonIndex + CHARACTERS_AFTER_LAST_COLON
    )}...${value.substring(value.length - LAST_CHARACTERS)}`;
  }
}
