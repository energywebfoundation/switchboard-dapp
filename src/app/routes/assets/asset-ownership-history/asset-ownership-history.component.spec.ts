import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetOwnershipHistoryComponent } from './asset-ownership-history.component';

xdescribe('AssetOwnershipHistoryComponent', () => {
  let component: AssetOwnershipHistoryComponent;
  let fixture: ComponentFixture<AssetOwnershipHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssetOwnershipHistoryComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetOwnershipHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
