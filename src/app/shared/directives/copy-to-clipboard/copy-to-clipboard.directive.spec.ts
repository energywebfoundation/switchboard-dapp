import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Component, DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { CopyToClipboardDirective } from './copy-to-clipboard.directive';
import { SwitchboardToastrService } from '../../services/switchboard-toastr.service';
import { getElement } from '@tests';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  template: `
    <div
      data-qa-id="copy"
      appCopyToClipboard
      [copyClipboard]="dataToCopy"
      [message]="message">
      Copy To clipboard
    </div>
  `,
})
class TestComponent {
  dataToCopy: string;
  message: string;
}

describe('CopyToClipboardDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let hostDebug: DebugElement;
  let toastrSpy;
  let clipboardSpy;
  beforeEach(waitForAsync(() => {
    toastrSpy = jasmine.createSpyObj('SwitchboardToastrService', [
      'success',
      'error',
    ]);
    clipboardSpy = jasmine.createSpyObj('Clipboard', ['copy']);

    TestBed.configureTestingModule({
      declarations: [CopyToClipboardDirective, TestComponent],
      providers: [
        { provide: SwitchboardToastrService, useValue: toastrSpy },
        { provide: Clipboard, useValue: clipboardSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    hostDebug = fixture.debugElement;
  });

  it('should create component with directive', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should not display toastr message when copyClipboard is not defined', () => {
    fixture.detectChanges();
    getElement(hostDebug)('copy').nativeElement.click();

    expect(toastrSpy.success).not.toHaveBeenCalled();
  });

  it('should display success message when clicking on directive', (done) => {
    component.message = 'message';
    component.dataToCopy = 'copy-this';
    clipboardSpy.copy.and.returnValue(true);
    fixture.detectChanges();

    getElement(hostDebug)('copy').nativeElement.click();

    expect(toastrSpy.success).toHaveBeenCalledWith(
      `${component.message} successfully copied to clipboard.`
    );
    done();
  });

  it('should display failure message when clicking on directive', (done) => {
    component.message = 'message';
    component.dataToCopy = 'copy-this';
    clipboardSpy.copy.and.returnValue(false);
    fixture.detectChanges();

    getElement(hostDebug)('copy').nativeElement.click();

    expect(toastrSpy.error).toHaveBeenCalledWith(`Copying to clipboard failed`);
    done();
  });
});
