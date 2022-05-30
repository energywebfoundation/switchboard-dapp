import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PreviewComponent } from './preview.component';
import { MatDialog } from '@angular/material/dialog';

describe('PreviewComponent', () => {
  let component: PreviewComponent;
  let fixture: ComponentFixture<PreviewComponent>;
  let matDialogSpy;
  beforeEach(
    waitForAsync(() => {
      matDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
      TestBed.configureTestingModule({
        declarations: [PreviewComponent],
        providers: [{ provide: MatDialog, useValue: matDialogSpy }],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
