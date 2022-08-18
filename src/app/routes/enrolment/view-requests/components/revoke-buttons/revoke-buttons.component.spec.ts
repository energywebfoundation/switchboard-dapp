import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RevokeButtonsComponent } from './revoke-buttons.component';
import { RevokeService } from '../../../services/revoke/revoke.service';

describe('RevokeButtonsComponent', () => {
  let component: RevokeButtonsComponent;
  let fixture: ComponentFixture<RevokeButtonsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [RevokeButtonsComponent],
      providers: [{ provide: RevokeService, useValue: {} }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RevokeButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
