import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { IssuerRequestsComponent } from './issuer-requests.component';

// TODO: add tests
xdescribe('IssuerRequestsComponent', () => {
  let component: IssuerRequestsComponent;
  let fixture: ComponentFixture<IssuerRequestsComponent>;

  beforeEach(waitForAsync( () => {
    TestBed.configureTestingModule({
      declarations: [ IssuerRequestsComponent ],
      providers: []
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssuerRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
