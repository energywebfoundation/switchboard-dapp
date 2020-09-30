import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestClaimComponent } from './request-claim.component';

describe('RequestClaimComponent', () => {
  let component: RequestClaimComponent;
  let fixture: ComponentFixture<RequestClaimComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestClaimComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestClaimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
