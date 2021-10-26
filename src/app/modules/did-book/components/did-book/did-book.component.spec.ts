import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DidBookComponent } from './did-book.component';

describe('DidBookComponent', () => {
  let component: DidBookComponent;
  let fixture: ComponentFixture<DidBookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DidBookComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DidBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
