export class TestHelper {
  static stringWithLength(length: number): string {
    return new Array(length + 1).join('a');
  }
}
