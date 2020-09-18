import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InitDataComponent } from './init-data.component';

describe('InitDataComponent', () => {
  let component: InitDataComponent;
  let fixture: ComponentFixture<InitDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InitDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InitDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
