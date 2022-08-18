import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivedPresentationsComponent } from './received-presentations.component';

describe('ReceivedPresentationsComponent', () => {
  let component: ReceivedPresentationsComponent;
  let fixture: ComponentFixture<ReceivedPresentationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReceivedPresentationsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceivedPresentationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
