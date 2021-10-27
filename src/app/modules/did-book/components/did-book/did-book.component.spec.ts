import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DidBookComponent } from './did-book.component';
import { DidBookService } from '../../services/did-book.service';

describe('DidBookComponent', () => {
  let component: DidBookComponent;
  let fixture: ComponentFixture<DidBookComponent>;
  const didBookServiceSpy = jasmine.createSpyObj(DidBookService, ['add', 'delete', 'getList']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DidBookComponent],
      providers: [{provide: DidBookService, useValue: didBookServiceSpy}]
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
