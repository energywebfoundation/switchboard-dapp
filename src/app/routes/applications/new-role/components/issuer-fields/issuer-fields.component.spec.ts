import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssuerFieldsComponent } from './issuer-fields.component';

describe('IssuerFieldsComponent', () => {
  let component: IssuerFieldsComponent;
  let fixture: ComponentFixture<IssuerFieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IssuerFieldsComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IssuerFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
