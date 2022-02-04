export class StringTransform {
  static removeWhiteSpaces(value) {
    return value.replace(/\s+/g, '');
  }
}
