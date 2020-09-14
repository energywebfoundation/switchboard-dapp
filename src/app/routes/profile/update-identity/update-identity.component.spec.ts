import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateIdentityComponent } from './update-identity.component';

describe('UpdateIdentityComponent', () => {
  let component: UpdateIdentityComponent;
  let fixture: ComponentFixture<UpdateIdentityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateIdentityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateIdentityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
