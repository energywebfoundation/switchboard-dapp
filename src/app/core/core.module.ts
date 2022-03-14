import { NgModule, Optional, SkipSelf } from '@angular/core';

import { ThemesService } from './themes/themes.service';

import { throwIfAlreadyLoaded } from './module-import-guard';

@NgModule({
  imports: [],
  providers: [ThemesService],
  declarations: [],
  exports: [],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
