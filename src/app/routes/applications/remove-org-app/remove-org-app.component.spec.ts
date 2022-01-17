import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveOrgAppComponent } from './remove-org-app.component';

xdescribe('RemoveOrgAppComponent', () => {
  let component: RemoveOrgAppComponent;
  let fixture: ComponentFixture<RemoveOrgAppComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RemoveOrgAppComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveOrgAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
