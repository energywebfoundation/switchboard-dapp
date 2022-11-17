import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NamespaceDetailsComponent } from './namespace-details.component';
import { DefaultValuePipe } from '../pipes/default-value.pipe';

describe('ApplicationDetailsComponent', () => {
  let component: NamespaceDetailsComponent;
  let fixture: ComponentFixture<NamespaceDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [NamespaceDetailsComponent, DefaultValuePipe],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NamespaceDetailsComponent);
    component = fixture.componentInstance;
    component.type = 'Org';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
