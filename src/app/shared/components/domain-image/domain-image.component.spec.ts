import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DomainImageComponent } from './domain-image.component';

describe('DomainImageComponent', () => {
  let component: DomainImageComponent;
  let fixture: ComponentFixture<DomainImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DomainImageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DomainImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
