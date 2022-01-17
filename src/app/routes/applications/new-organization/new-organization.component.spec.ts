import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewOrganizationComponent } from './new-organization.component';

xdescribe('NewOrganizationComponent', () => {
  let component: NewOrganizationComponent;
  let fixture: ComponentFixture<NewOrganizationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewOrganizationComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewOrganizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
