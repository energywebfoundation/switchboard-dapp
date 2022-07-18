import { TestBed } from '@angular/core/testing';

import { DialogService } from './dialog.service';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';

describe('DialogService', () => {
  let service: DialogService;
  let dialogSpy;

  const setUp = (afterClosed?: boolean) => {
    dialogSpy.open.and.returnValue({ afterClosed: () => of(afterClosed) });
  };
  beforeEach(() => {
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    TestBed.configureTestingModule({
      providers: [{ provide: MatDialog, useValue: dialogSpy }],
    });
    service = TestBed.inject(DialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should open confirm dialog', (done) => {
    setUp();
    service.confirm({}).subscribe(() => {
      expect(dialogSpy.open).toHaveBeenCalled();
      done();
    });
  });
});
