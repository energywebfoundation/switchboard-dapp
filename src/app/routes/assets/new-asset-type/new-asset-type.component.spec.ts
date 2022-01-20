import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAssetTypeComponent } from './new-asset-type.component';

xdescribe('NewAssetTypeComponent', () => {
  let component: NewAssetTypeComponent;
  let fixture: ComponentFixture<NewAssetTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewAssetTypeComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewAssetTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
