import { Injectable } from '@angular/core';
import { EnrolmentClaim } from '../../../models/enrolment-claim';
import { BehaviorSubject } from 'rxjs';
import { FilterBuilder } from '../../../enrolment-list/filter-builder/filter.builder';

@Injectable({
  providedIn: 'root',
})
export class CascadingFilterService {
  private claims = new BehaviorSubject<EnrolmentClaim[]>([]);
  private organizationFilter = '';
  private applicationFilter = '';
  private roleFilter = '';

  private filteredList = new BehaviorSubject<EnrolmentClaim[]>([]);
  private organizations$ = new BehaviorSubject<string[]>([]);
  private applications$ = new BehaviorSubject<string[]>([]);
  private roleNames$ = new BehaviorSubject<string[]>([]);

  setClaims(claims: EnrolmentClaim[]) {
    this.claims.next([...claims]);
    this.updateListsOnOrgChange();
  }

  setOrganizationFilter(filter: string) {
    if (this.organizationFilter === filter) {
      return;
    }
    this.organizationFilter = filter;
    this.resetApplicationFilter();
    this.resetRoleNameFilter();
    this.updateListsOnOrgChange();
  }

  setApplicationFilter(filter: string) {
    if (this.applicationFilter === filter) {
      return;
    }
    this.applicationFilter = filter;
    this.resetRoleNameFilter();
    this.updateListsOnAppChange();
  }

  setRoleFilter(filter: string) {
    if (this.roleFilter === filter) {
      return;
    }
    this.roleFilter = filter;
    this.updateListsOnRoleChange();
  }

  getOrganizations$() {
    return this.organizations$.asObservable();
  }

  getApplications$() {
    return this.applications$.asObservable();
  }

  getRoleNames$() {
    return this.roleNames$.asObservable();
  }

  getList$() {
    return this.filteredList.asObservable();
  }

  private getClaims() {
    return this.claims.value;
  }

  private updateListsOnRoleChange() {
    this.updateRoleNameList();
    this.updateFilteredList();
  }

  private updateListsOnAppChange() {
    this.updateApplicationsList();
    this.updateRoleNameList();
    this.updateFilteredList();
  }

  private updateListsOnOrgChange() {
    this.updateOrganizationList();
    this.updateApplicationsList();
    this.updateRoleNameList();
    this.updateFilteredList();
  }

  private updateOrganizationList() {
    this.organizations$.next(
      this.getUnique(
        new FilterBuilder(this.getClaims())
          .organization(this.organizationFilter)
          .build()
          .map((claim) => claim.organization)
      )
    );
  }

  private updateApplicationsList() {
    this.applications$.next(
      this.getUnique(
        new FilterBuilder(this.getClaims())
          .organization(this.organizationFilter)
          .application(this.applicationFilter)
          .build()
          .map((claim) => claim?.application)
          .filter(Boolean)
      )
    );
  }

  private updateRoleNameList() {
    this.roleNames$.next(
      this.getUnique(
        new FilterBuilder(this.getClaims())
          .organization(this.organizationFilter)
          .application(this.applicationFilter)
          .roleName(this.roleFilter)
          .build()
          .map((claim) => claim?.roleName)
      )
    );
  }

  private getUnique(list: string[]) {
    return Array.from(new Set(list));
  }

  private updateFilteredList() {
    this.filteredList.next(
      new FilterBuilder(this.getClaims())
        .organization(this.organizationFilter)
        .application(this.applicationFilter)
        .roleName(this.roleFilter)
        .build()
    );
  }

  private resetApplicationFilter() {
    this.applicationFilter = '';
  }

  private resetRoleNameFilter() {
    this.roleFilter = '';
  }
}
