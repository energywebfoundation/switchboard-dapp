import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DidBookListComponent } from './did-book-list.component';

describe('DidBookListComponent', () => {
  let component: DidBookListComponent;
  let fixture: ComponentFixture<DidBookListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DidBookListComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DidBookListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
