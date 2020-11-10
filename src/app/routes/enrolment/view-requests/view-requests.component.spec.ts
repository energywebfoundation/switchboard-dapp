import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRequestsComponent } from './view-requests.component';

describe('ViewRequestsComponent', () => {
  let component: ViewRequestsComponent;
  let fixture: ComponentFixture<ViewRequestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewRequestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
