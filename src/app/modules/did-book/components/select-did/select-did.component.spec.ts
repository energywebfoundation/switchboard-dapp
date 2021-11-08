import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectDidComponent } from './select-did.component';

describe('SelectDidComponent', () => {
  let component: SelectDidComponent;
  let fixture: ComponentFixture<SelectDidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectDidComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectDidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
