import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssuerFieldFormComponent } from './issuer-field-form.component';

describe('IssuerFieldFormComponent', () => {
  let component: IssuerFieldFormComponent;
  let fixture: ComponentFixture<IssuerFieldFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IssuerFieldFormComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IssuerFieldFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
