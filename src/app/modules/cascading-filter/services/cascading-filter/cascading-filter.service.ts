import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FilterBuilder } from '../../../../routes/enrolment/enrolment-list/filter-builder/filter.builder';
import { FilterStatus } from '../../../../routes/enrolment/enrolment-list/models/filter-status.enum';
import { ICascadingFilter } from './cascading-filter.interface';

@Injectable()
export class CascadingFilterService {
  private list = new BehaviorSubject<ICascadingFilter[]>([]);
  private organizationFilter = '';
  private applicationFilter = '';
  private roleFilter = '';
  private statusFilter = FilterStatus.All;
  private didFilter = '';

  private filteredList = new BehaviorSubject<ICascadingFilter[]>([]);
  private organizations$ = new BehaviorSubject<string[]>([]);
  private applications$ = new BehaviorSubject<string[]>([]);
  private roleNames$ = new BehaviorSubject<string[]>([]);

  setItems(items: ICascadingFilter[]): void {
    this.list.next([...items]);
    this.updateListsOnOrgChange();
  }

  setOrganizationFilter(filter: string): void {
    if (this.organizationFilter === filter) {
      return;
    }
    this.organizationFilter = filter;
    this.resetApplicationFilter();
    this.resetRoleNameFilter();
    this.updateListsOnOrgChange();
  }

  setApplicationFilter(filter: string): void {
    if (this.applicationFilter === filter) {
      return;
    }
    this.applicationFilter = filter;
    this.resetRoleNameFilter();
    this.updateListsOnAppChange();
  }

  setRoleFilter(filter: string): void {
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

  getOrganizations$(): Observable<string[]> {
    return this.organizations$.asObservable();
  }

  getApplications$(): Observable<string[]> {
    return this.applications$.asObservable();
  }

  getRoleNames$(): Observable<string[]> {
    return this.roleNames$.asObservable();
  }

  getList$(): Observable<ICascadingFilter[]> {
    return this.filteredList.asObservable();
  }

  private getClaims(): ICascadingFilter[] {
    return this.list.value;
  }

  private updateListsOnRoleChange(): void {
    this.updateRoleNameList();
    this.updateFilteredList();
  }

  private updateListsOnAppChange(): void {
    this.updateApplicationsList();
    this.updateRoleNameList();
    this.updateFilteredList();
  }

  private updateListsOnOrgChange(): void {
    this.updateOrganizationList();
    this.updateApplicationsList();
    this.updateRoleNameList();
    this.updateFilteredList();
  }

  private updateOrganizationList(): void {
    this.organizations$.next(
      this.getUnique(
        new FilterBuilder(this.getClaims())
          .status(this.statusFilter)
          .organization(this.organizationFilter)
          .build()
          .map((claim) => claim.organization)
      )
    );
  }

  private updateApplicationsList(): void {
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

  private updateRoleNameList(): void {
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

  private getUnique(list: string[]): string[] {
    return Array.from(new Set(list));
  }

  private updateFilteredList(): void {
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

  private resetApplicationFilter(): void {
    this.applicationFilter = '';
  }

  private resetRoleNameFilter(): void {
    this.roleFilter = '';
  }

  private resetOrganizationFilter(): void {
    this.organizationFilter = '';
  }
}
