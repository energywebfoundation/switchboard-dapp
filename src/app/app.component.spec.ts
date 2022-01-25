import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

import { CoreModule } from './core/core.module';
import { LayoutModule } from './layout/layout.module';
import { SharedModule } from './shared/shared.module';
import { RoutesModule } from './routes/routes.module';
import { APP_BASE_HREF } from '@angular/common';
import { provideMockStore } from '@ngrx/store/testing';
import { ThemesService } from './core/themes/themes.service';

describe('App: ewUIBoilerPlate', () => {
  beforeEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;

    TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [CoreModule, LayoutModule, SharedModule, RoutesModule],
      providers: [
        provideMockStore(),
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: ThemesService, useValue: {} },
      ],
    });
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
});
