import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RawDataDialogComponent } from './raw-data-dialog.component';

describe('RawDataDialogComponent', () => {
  let component: RawDataDialogComponent;
  let fixture: ComponentFixture<RawDataDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RawDataDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RawDataDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
