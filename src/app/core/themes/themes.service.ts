import { Injectable } from '@angular/core';
import { EnvService } from '../../shared/services/env/env.service';

@Injectable()
export class ThemesService {
  readonly defaultTheme = 'default';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private styleTag: any;

  constructor(private env: EnvService) {
    this.createElement();
    this.setTheme(env.theme);
  }

  setTheme(name: string) {
    this.injectStylesheet(
      name + '.css' + `?t=${new Date(Date.now()).getTime()}`
    );
  }

  injectStylesheet(theme: string) {
    this.styleTag.href = `${theme}`;
  }

  getDefaultTheme() {
    return this.defaultTheme;
  }

  private createElement() {
    const head = document.head || document.getElementsByTagName('head')[0];
    this.styleTag = document.createElement('link');
    this.styleTag.id = 'client-theme';
    this.styleTag.type = 'text/css';
    this.styleTag.rel = 'stylesheet';

    head.appendChild(this.styleTag);
  }
}
