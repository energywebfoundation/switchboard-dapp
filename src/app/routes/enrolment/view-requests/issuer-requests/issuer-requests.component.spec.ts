import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssuerRequestsComponent } from './issuer-requests.component';

describe('IssuerRequestsComponent', () => {
  let component: IssuerRequestsComponent;
  let fixture: ComponentFixture<IssuerRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IssuerRequestsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IssuerRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
