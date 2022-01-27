import { TestBed } from '@angular/core/testing';
import { ThemesService } from './themes.service';
import { EnvService } from '../../shared/services/env/env.service';

describe('Service: Themes', () => {
  let service: ThemesService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ThemesService, { provide: EnvService, useValue: {} }],
    });

    service = TestBed.inject(ThemesService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
