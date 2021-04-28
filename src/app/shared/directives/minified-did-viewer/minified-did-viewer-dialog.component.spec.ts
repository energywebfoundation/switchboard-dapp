import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinifiedDidViewerDialogComponent } from './minified-did-viewer-dialog.component';

describe('MinifiedDidViewerDialogComponent', () => {
  let component: MinifiedDidViewerDialogComponent;
  let fixture: ComponentFixture<MinifiedDidViewerDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MinifiedDidViewerDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MinifiedDidViewerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
