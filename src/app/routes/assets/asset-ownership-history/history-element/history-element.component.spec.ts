import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryElementComponent } from './history-element.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DidFormatMinifierPipe } from '../../../../shared/pipes/did-format-minifier/did-format-minifier.pipe';

describe('HistoryElementComponent', () => {
  let component: HistoryElementComponent;
  let fixture: ComponentFixture<HistoryElementComponent>;
  let h4: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HistoryElementComponent, DidFormatMinifierPipe],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryElementComponent);
    component = fixture.componentInstance;
    h4 = fixture.nativeElement.querySelector('h4');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check if header text is always uppercase', () => {
    const headerText = 'header';
    component.element = { header: headerText, did: '' };
    fixture.detectChanges();
    expect(h4.textContent).toBe(headerText.toUpperCase());
  });
});
