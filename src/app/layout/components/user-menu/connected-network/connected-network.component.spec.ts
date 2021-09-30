import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectedNetworkComponent } from './connected-network.component';

describe('ConnectedNetworkComponent', () => {
  let component: ConnectedNetworkComponent;
  let fixture: ComponentFixture<ConnectedNetworkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConnectedNetworkComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectedNetworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
