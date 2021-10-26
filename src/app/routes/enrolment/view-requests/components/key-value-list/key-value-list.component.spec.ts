import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeyValueListComponent } from './key-value-list.component';

describe('KeyValueListComponent', () => {
  let component: KeyValueListComponent;
  let fixture: ComponentFixture<KeyValueListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KeyValueListComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KeyValueListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
