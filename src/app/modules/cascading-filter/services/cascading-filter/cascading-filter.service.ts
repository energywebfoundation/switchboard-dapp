import { Injectable } from '@angular/core';
import { EnrolmentClaim } from '../../../../routes/enrolment/models/enrolment-claim';
import { BehaviorSubject } from 'rxjs';
import { FilterBuilder } from '../../../../routes/enrolment/enrolment-list/filter-builder/filter.builder';
import { FilterStatus } from '../../../../routes/enrolment/enrolment-list/models/filter-status.enum';

@Injectable()
export class CascadingFilterService {
  private claims = new BehaviorSubject<EnrolmentClaim[]>([]);
  private organizationFilter = '';
  private applicationFilter = '';
  private roleFilter = '';
  private statusFilter = FilterStatus.All;
  private didFilter = '';

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

  setStatus(status: FilterStatus): void {
    if (status === this.statusFilter || !status) {
      return;
    }
    this.statusFilter = status;
    this.resetOrganizationFilter();
    this.resetApplicationFilter();
    this.resetRoleNameFilter();
    this.updateListsOnOrgChange();
  }

  setDID(did: string): void {
    if (this.didFilter === did) {
      return;
    }

    this.didFilter = did;
    this.updateFilteredList();
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
          .status(this.statusFilter)
          .organization(this.organizationFilter)
          .build()
          .map((claim) => claim?.organization)
      )
    );
  }

  private updateApplicationsList() {
    this.applications$.next(
      this.getUnique(
        new FilterBuilder(this.getClaims())
          .status(this.statusFilter)
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
          .status(this.statusFilter)
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
        .status(this.statusFilter)
        .did(this.didFilter)
        .build()
    );
  }

  private resetApplicationFilter() {
    this.applicationFilter = '';
  }

  private resetRoleNameFilter() {
    this.roleFilter = '';
  }

  private resetOrganizationFilter() {
    this.organizationFilter = '';
  }
}
