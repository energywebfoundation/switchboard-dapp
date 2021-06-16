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

export interface SwitchboardToaster {
    message: string;
    type: string;
    isNew: boolean;
}
@Injectable({
    providedIn: 'root'
})
export class SwitchboardToasterService {
    private massageList = new BehaviorSubject<SwitchboardToaster[]>([]);

    constructor(private toaster: ToastrService) {
    }

    getMessageList(): Observable<SwitchboardToaster[]> {
        return this.massageList.asObservable();
    }

    reset(): void {
        this.massageList.next([]);
    }

    readAllItems(): void {
        this.massageList.next(this.massageList.getValue().map(item => {
            item.isNew = false;
            return item;
        }));
    }

    show(message?: string, title?: string, override?: Partial<IndividualConfig>, type?: string): any {
        this.toaster.show(message, title, override, type);
        this.updateMessageList(message, type);

    }

    error(message?: string, title?: string, override?: Partial<IndividualConfig>): any {
        this.toaster.error(message, title, override);
        this.updateMessageList(message, MessageType.error);
    }

    info(message?: string, title?: string, override?: Partial<IndividualConfig>): any {
        this.toaster.info(message, title, override);
        this.updateMessageList(message, MessageType.info);
    }

    success(message?: string, title?: string, override?: Partial<IndividualConfig>): any {
        this.toaster.success(message, title, override);
        this.updateMessageList(message, MessageType.success);
    }

    warning(message?: string, title?: string, override?: Partial<IndividualConfig>): any {
        this.toaster.warning(message, title, override);
        this.updateMessageList(message, MessageType.warning);
    }

    private updateMessageList(message: string, type: string): void {
        let list = this.massageList.getValue();
        list.unshift({message, type, isNew: true});
        if (list.length > 20) {
            list = list.slice(0, 20);
        }
        this.massageList.next(list);
    }
}
