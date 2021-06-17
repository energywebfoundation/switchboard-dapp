import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { IndividualConfig } from 'ngx-toastr/toastr/toastr-config';
import { BehaviorSubject, Observable } from 'rxjs';

enum MessageType {
    error = 'toast-error',
    info = 'toast-info',
    success = 'toast-success',
    warning = 'toast-warning'
}

export interface SwitchboardToastr {
    message: string;
    type: string;
    isNew: boolean;
}
@Injectable({
    providedIn: 'root'
})
export class SwitchboardToastrService {
    private readonly maxLength = 20;
    private massageList = new BehaviorSubject<SwitchboardToastr[]>([]);

    constructor(private toastr: ToastrService) {
    }

    getMessageList(): Observable<SwitchboardToastr[]> {
        return this.massageList.asObservable();
    }

    reset(): void {
        this.massageList.next([]);
    }

    readAllItems(): void {
        this.massageList.next(this.massageList.getValue().map(item => ({...item, isNew: false})));
    }

    show(message?: string, title?: string, override?: Partial<IndividualConfig>, type?: string): any {
        this.toastr.show(message, title, override, type);
        this.updateMessageList(message, type);

    }

    error(message?: string, title?: string, override?: Partial<IndividualConfig>): any {
        this.toastr.error(message, title, override);
        this.updateMessageList(message, MessageType.error);
    }

    info(message?: string, title?: string, override?: Partial<IndividualConfig>): any {
        this.toastr.info(message, title, override);
        this.updateMessageList(message, MessageType.info);
    }

    success(message?: string, title?: string, override?: Partial<IndividualConfig>): any {
        this.toastr.success(message, title, override);
        this.updateMessageList(message, MessageType.success);
    }

    warning(message?: string, title?: string, override?: Partial<IndividualConfig>): any {
        this.toastr.warning(message, title, override);
        this.updateMessageList(message, MessageType.warning);
    }

    private updateMessageList(message: string, type: string): void {
        const list = [{message, type, isNew: true}, ...this.massageList.getValue()].slice(0, this.maxLength);
        this.massageList.next(list);
    }
}
