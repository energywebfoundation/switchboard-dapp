import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifiablePresentationComponent } from './verifiable-presentation.component';

describe('VerifiablePresentationComponent', () => {
  let component: VerifiablePresentationComponent;
  let fixture: ComponentFixture<VerifiablePresentationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VerifiablePresentationComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifiablePresentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
