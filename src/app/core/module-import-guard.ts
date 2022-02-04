// https://angular.io/styleguide#!#04-12
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function throwIfAlreadyLoaded(parentModule: any, moduleName: string) {
  if (parentModule) {
    throw new Error(
      `${moduleName} has already been loaded. Import Core modules in the AppModule only.`
    );
  }
}
