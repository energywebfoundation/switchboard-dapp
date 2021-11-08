import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { DidBookRecord } from '../components/models/did-book-record';
import { LoadingService } from '../../../shared/services/loading.service';
import { finalize } from 'rxjs/operators';

@Injectable()
export class DidBookHttpService {
  private readonly didBookEndpoint = '/didContact';
  private readonly httpOptions = {withCredentials: true};

  constructor(private http: HttpClient,
              private loadingService: LoadingService) {
  }

  getList() {
    return this.http.get(environment.cacheServerUrl + this.didBookEndpoint, this.httpOptions);
  }

  delete(uuid: string) {
    this.loadingService.show('Deleting DID record');
    return this.http.delete(environment.cacheServerUrl + this.didBookEndpoint + `/${uuid}`, this.httpOptions)
      .pipe(finalize(() => this.loadingService.hide()));
  }

  add(record: Partial<DidBookRecord>) {
    this.loadingService.show('Adding DID record');
    return this.http.post(environment.cacheServerUrl + this.didBookEndpoint, record, this.httpOptions)
      .pipe(finalize(() => this.loadingService.hide()));
  }
}
