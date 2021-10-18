import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewArbitraryCredentialComponent } from './new-arbitrary-credential.component';

describe('NewArbitraryCredentialComponent', () => {
  let component: NewArbitraryCredentialComponent;
  let fixture: ComponentFixture<NewArbitraryCredentialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewArbitraryCredentialComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewArbitraryCredentialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
