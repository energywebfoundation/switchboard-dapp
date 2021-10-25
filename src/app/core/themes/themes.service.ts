import { Injectable } from '@angular/core';

@Injectable()
export class ThemesService {

  readonly defaultTheme = 'C';
  private styleTag: any;

  constructor() {
    this.createElement();
    this.setTheme('C');
  }

  setTheme(name: 'A' | 'B' | 'C') {
    switch (name) {
      case 'A':
        return this.injectStylesheet('theme-a.css');
      case 'B':
        return this.injectStylesheet('theme-b.css');  
      case 'C':
      default:
        return this.injectStylesheet('theme-c.css');
    }
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
