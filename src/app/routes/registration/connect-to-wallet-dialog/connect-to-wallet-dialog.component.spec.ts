import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectToWalletDialogComponent } from './connect-to-wallet-dialog.component';

xdescribe('ConnectToWalletDialogComponent', () => {
  let component: ConnectToWalletDialogComponent;
  let fixture: ComponentFixture<ConnectToWalletDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConnectToWalletDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectToWalletDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
