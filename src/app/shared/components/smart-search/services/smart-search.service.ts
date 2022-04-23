import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IApp, IOrganization, IRole, SearchType } from 'iam-client-lib';
import { DomainsFacadeService } from '../../../services/domains-facade/domains-facade.service';

@Injectable({
  providedIn: 'root',
})
export class SmartSearchService {
  constructor(private domainsFacade: DomainsFacadeService) {}

  searchBy(
    searchWord: string,
    types: SearchType[] = [SearchType.Role]
  ): Observable<(IApp | IRole | IOrganization)[]> {
    const word = searchWord.trim();
    if (word.length > 2) {
      return this.domainsFacade.getENSTypesBySearchPhrase(
        word.toLowerCase(),
        types
      );
    }

    return of([]);
  }
}
