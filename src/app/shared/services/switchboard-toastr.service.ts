/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, OnDestroy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { IndividualConfig } from 'ngx-toastr/toastr/toastr-config';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

enum MessageType {
  error = 'toast-error',
  info = 'toast-info',
  success = 'toast-success',
  warning = 'toast-warning',
}

export interface SwitchboardToastr {
  message: string;
  type: string;
  isNew: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class SwitchboardToastrService implements OnDestroy {
  private readonly maxMessagesNumber = 20;
  private messageList = new BehaviorSubject<SwitchboardToastr[]>([]);

  constructor(private toastr: ToastrService) {}

  ngOnDestroy() {
    this.reset();
  }

  getMessageList(): Observable<SwitchboardToastr[]> {
    return this.messageList.asObservable();
  }

  newMessagesAmount(): Observable<number> {
    return this.getMessageList().pipe(
      map(
        (items: SwitchboardToastr[]) =>
          items.filter((item) => item.isNew).length
      )
    );
  }

  areNewNotifications(): Observable<boolean> {
    return this.newMessagesAmount().pipe(map((value) => value !== 0));
  }

  reset(): void {
    this.messageList.next([]);
  }

  readAll(): void {
    this.messageList.next(
      this.messageList.getValue().map((item) => ({ ...item, isNew: false }))
    );
  }

  show(
    message?: string,
    title?: string,
    override?: Partial<IndividualConfig>,
    type?: string
  ): any {
    this.toastr.show(message, title, override, type);
    this.updateMessageList(message, type);
  }

  error(
    message?: string,
    title?: string,
    override?: Partial<IndividualConfig>
  ): any {
    this.toastr.error(message, title, override);
    this.updateMessageList(message, MessageType.error);
  }

  info(
    message?: string,
    title?: string,
    override?: Partial<IndividualConfig>
  ): any {
    this.toastr.info(message, title, override);
    this.updateMessageList(message, MessageType.info);
  }

  success(
    message?: string,
    title?: string,
    override?: Partial<IndividualConfig>
  ): any {
    this.toastr.success(message, title, override);
    this.updateMessageList(message, MessageType.success);
  }

  warning(
    message?: string,
    title?: string,
    override?: Partial<IndividualConfig>
  ): any {
    this.toastr.warning(message, title, override);
    this.updateMessageList(message, MessageType.warning);
  }

  private updateMessageList(message: string, type: string): void {
    const list = [
      { message, type, isNew: true },
      ...this.messageList.getValue(),
    ].slice(0, this.maxMessagesNumber);
    this.messageList.next(list);
  }
}
