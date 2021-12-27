import { Injectable } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { SearchType } from 'iam-client-lib';
import { DomainsFacadeService } from '../../../services/domains-facade/domains-facade.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SmartSearchService {

  constructor(private domainsFacade: DomainsFacadeService) {
  }

  searchBy(searchWord: string, types: SearchType[] = [SearchType.Role]): Observable<string[]> {
    const word = searchWord.trim();
    if (word?.length > 2) {
      return this.getListOfNamespaces(word.toLowerCase(), types);
    }

    return of([]);
  }

  private getListOfNamespaces(word: string, types: SearchType[]) {
    return from(
      this.domainsFacade.getENSTypesBySearchPhrase(
        word,
        types
      )
    ).pipe(
      map((v) => v.map(item => item.namespace))
    );
  }
}
