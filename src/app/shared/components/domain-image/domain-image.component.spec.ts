import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DomainImageComponent } from './domain-image.component';

describe('DomainImageComponent', () => {
  let component: DomainImageComponent;
  let fixture: ComponentFixture<DomainImageComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [DomainImageComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(DomainImageComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    component.type = "Organization";
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should return no-organization-image when calling defaultUrl', () => {
    component.type = "Organization";
    fixture.detectChanges();

    expect(component.defaultUrl).toContain('no-organization-image.png');
  });
});
