import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CardInfoComponent } from './card-info.component';
import { getElement } from '@tests';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { MatIconTestingModule } from '@angular/material/icon/testing';

describe('CardInfoComponent', () => {
  let component: CardInfoComponent;
  let fixture: ComponentFixture<CardInfoComponent>;
  let hostDebug: DebugElement;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [MatIconTestingModule],
      declarations: [CardInfoComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardInfoComponent);
    component = fixture.componentInstance;
    hostDebug = fixture.debugElement;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display only title', () => {
    component.title = 'Title example';
    fixture.detectChanges();

    const { title, description } = getSelectors(hostDebug);

    expect(title).toBeTruthy();
    expect(description).toBeFalsy();
  });

  it('should display only description', () => {
    component.description = 'Description';
    fixture.detectChanges();

    const { title, description } = getSelectors(hostDebug);

    expect(title).toBeFalsy();
    expect(description).toBeTruthy();
  });
});

const getSelectors = (hostDebug) => ({
  title: getElement(hostDebug)('card-info-title')?.nativeElement,
  description: getElement(hostDebug)('card-info-description')?.nativeElement,
});
