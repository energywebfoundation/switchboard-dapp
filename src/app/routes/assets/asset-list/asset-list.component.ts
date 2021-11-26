import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Asset, AssetHistoryEventType } from 'iam-client-lib';
import { CancelButton } from '../../../layout/loading/loading.component';
import { AssetListType } from '../../../shared/constants/shared-constants';
import { IamService } from '../../../shared/services/iam.service';
import { LoadingService } from '../../../shared/services/loading.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { TransferOwnershipComponent } from '../../applications/transfer-ownership/transfer-ownership.component';
import { ConfirmationDialogComponent } from '../../widgets/confirmation-dialog/confirmation-dialog.component';
import { AssetOwnershipHistoryComponent } from '../asset-ownership-history/asset-ownership-history.component';
import { EditAssetDialogComponent } from '../edit-asset-dialog/edit-asset-dialog.component';
import { distinctUntilChanged, filter, finalize, first, map, switchMap, takeUntil } from 'rxjs/operators';
import { from, Observable, Subject } from 'rxjs';
import { VerificationMethodComponent } from '../verification-method/verification-method.component';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { SwitchboardToastrService } from '../../../shared/services/switchboard-toastr.service';
import { ASSET_DEFAULT_LOGO } from '../models/asset-default-logo';
import { DidQrCodeComponent } from '../did-qr-code/did-qr-code.component';
import { FormControl } from '@angular/forms';
import { NewIssueVcComponent } from '../../../modules/issue-vc/new-issue-vc/new-issue-vc.component';
import { Store } from '@ngrx/store';
import { OwnedAssetsActions, OwnedAssetsSelectors } from '@state';

const HEADER_TRANSFER_OWNERSHIP = 'Transfer Ownership';
const HEADER_CANCEL_OWNERSHIP = 'Cancel Offered Ownership';
const HEADER_ACCEPT_OWNERSHIP = 'Accept Offered Asset';
const HEADER_REJECT_OWNERSHIP = 'Reject Offered Asset';

export interface AssetList extends Asset {
  hasEnrolments: boolean;
}


@Component({
  selector: 'app-asset-list',
  templateUrl: './asset-list.component.html',
  styleUrls: ['./asset-list.component.scss']
})
export class AssetListComponent implements OnInit, OnDestroy {
  @Input() listType: number;
  @Input() showDidFilter = false;
  @ViewChild(MatSort) sort: MatSort;
  @Output() selectTab = new EventEmitter<any>();
  searchByDid = new FormControl(undefined);
  AssetListType = AssetListType;

  dataSource: MatTableDataSource<AssetList> = new MatTableDataSource([]);
  displayedColumns: string[] = ['logo', 'createdDate', 'name', 'id'];

  defaultLogo = ASSET_DEFAULT_LOGO;

  private _iamSubscriptionId: number;
  private unsubscribe = new Subject<void>();
  private _shadowList;

  constructor(private toastr: SwitchboardToastrService,
              private dialog: MatDialog,
              private iamService: IamService,
              private notifService: NotificationService,
              private loadingService: LoadingService,
              private route: Router,
              private store: Store) {

  }

  async ngOnDestroy(): Promise<void> {
    // Unsubscribe from IAM Events
    await this.iamService.messagingService.unsubscribeFrom(this._iamSubscriptionId);
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  async ngOnInit(): Promise<void> {
    // Subscribe to IAM events
    this._iamSubscriptionId = await this.iamService.messagingService.subscribeTo({
      messageHandler: this._handleMessage.bind(this)
    });

    // Set Table Columns
    if (this.listType === AssetListType.OFFERED_ASSETS) {
      this.displayedColumns.push('owner');
    } else {
      this.displayedColumns.push('offeredTo');
      if (this.listType === AssetListType.MY_ASSETS) {
        this.displayedColumns.push('modifiedDate');
      }
    }
    this.displayedColumns.push('actions');

    // Initialize List
    if (this.listType === AssetListType.MY_ASSETS) {
      this.getAssetList();
    }

    // Initialize Sorting
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (item, property) => {
      if (property === 'createdDate') {
        if (this.listType === AssetListType.OFFERED_ASSETS) {
          return item['modifiedDate'];
        } else {
          return item['createdDate'];
        }
      } else {
        return item[property];
      }
    };

    this._checkDidControlChanges();
  }

  getAssetList() {
    this.subscribeTo(this.assetListFactory());
  }

  subscribeTo(source: Observable<AssetList[]>) {
    return source.pipe(
      finalize(() => this.loadingService.hide())
    ).subscribe((data: AssetList[]) => {
      this.dataSource.data = data;
      this._shadowList = data;
    }, error => {
      console.error(error);
      this.toastr.error(error.message || 'Could not retrieve list. Please contact system administrator.');
    });
  }

  transferOwnership(type: any, data: Asset) {
    const dialogRef = this.dialog.open(TransferOwnershipComponent, {
      width: '600px', data: {
        assetDid: data.id,
        type,
        owner: data.owner
      },
      maxWidth: '100%',
      disableClose: true
    }).afterClosed().subscribe((res: any) => {
      if (res) {
        this.toastr.success('Asset is offered successfully.', HEADER_TRANSFER_OWNERSHIP);
        this.getAssetList();
      }
      dialogRef.unsubscribe();
    });
  }

  createVC(element) {
    console.log(element);
    this.dialog.open(NewIssueVcComponent, {
      width: '600px',
      data: {
        did: element.id
      },
      maxWidth: '100%',
      disableClose: true
    });
  }

  async cancelAssetOffer(data: Asset) {
    if (await this._confirm('The offered ownership of this asset will be cancelled.', HEADER_CANCEL_OWNERSHIP)) {
      try {
        this.loadingService.show('Please confirm this transaction in your connected wallet.', CancelButton.ENABLED);
        await this.iamService.assetsService.cancelAssetOffer({
          assetDID: data.id
        });
        this.toastr.success('Offered ownership is cancelled successfully.', HEADER_CANCEL_OWNERSHIP);
        this.getAssetList();
      } catch (e) {
        console.error(e);
        this.toastr.error(e.message || 'A system error has occured. Please contact system administrator.', HEADER_CANCEL_OWNERSHIP);
      } finally {
        this.loadingService.hide();
      }
    }
  }

  async approveAssetOffer(data: Asset) {
    if (await this._confirm('You will become the owner of this asset.', HEADER_ACCEPT_OWNERSHIP)) {
      try {
        this.loadingService.show('Please confirm this transaction in your connected wallet.', CancelButton.ENABLED);
        await this.iamService.assetsService.acceptAssetOffer({
          assetDID: data.id
        });
        this.toastr.success('A new asset is added successfully to your list.', HEADER_ACCEPT_OWNERSHIP);
        this.notifService.decreaseAssetsOfferedToMeCount();
        this.selectTab.emit(0);
      } catch (e) {
        console.error(e);
        this.toastr.error(e.message || 'A system error has occured. Please contact system administrator.', HEADER_ACCEPT_OWNERSHIP);
      } finally {
        this.loadingService.hide();
      }
    }
  }

  async rejectAssetOffer(data: Asset) {
    if (await this._confirm('You are rejecting this offered asset.', HEADER_REJECT_OWNERSHIP)) {
      try {
        this.loadingService.show('Please confirm this transaction in your connected wallet.', CancelButton.ENABLED);
        await this.iamService.assetsService.rejectAssetOffer({
          assetDID: data.id
        });
        this.toastr.success('You have rejected an offered asset successfully.', HEADER_REJECT_OWNERSHIP);
        this.getAssetList();
        this.notifService.decreaseAssetsOfferedToMeCount();
      } catch (e) {
        console.error(e);
        this.toastr.error(e.message || 'A system error has occured. Please contact system administrator.', HEADER_REJECT_OWNERSHIP);
      } finally {
        this.loadingService.hide();
      }
    }
  }

  viewOwnershipHistory(data: any) {
    const dialogRef = this.dialog.open(AssetOwnershipHistoryComponent, {
      width: '600px',
      data: {
        id: data.id
      },
      maxWidth: '100%',
      disableClose: true
    }).afterClosed().subscribe((res: any) => {
      dialogRef.unsubscribe();
    });
  }

  viewVerificationMethod(data: any) {
    const dialogRef = this.dialog.open(VerificationMethodComponent, {
      width: '600px',
      data: {
        id: data.id
      },
      maxWidth: '100%',
      disableClose: true
    }).afterClosed().subscribe((res: any) => {
      dialogRef.unsubscribe();
    });
  }


  viewAssetEnrolments(data: Asset) {
    this.route.navigate(['assets/enrolment/' + data.id]);
  }

  edit(data: Asset) {
    const dialogRef = this.dialog.open(EditAssetDialogComponent, {
      width: '600px',
      data,
      maxWidth: '100%',
      disableClose: true
    });

    this.subscribeTo(dialogRef.afterClosed().pipe(
      first(),
      filter(Boolean),
      switchMap(() => this.assetListFactory())
    ));
  }

  generateQrCode(data: Asset) {
    this.dialog.open(DidQrCodeComponent, {
      width: '400px',
      data,
      maxWidth: '100%',
    });
  }

  updateSearchByDidValue(value) {
    if (!value.did) {
      return;
    }
    this.searchByDid.setValue(value.did);
  }

  private _checkDidControlChanges(): void {
    this.searchByDid.valueChanges
      .pipe(
        distinctUntilChanged((prevValue, currentValue) => prevValue === currentValue),
        takeUntil(this.unsubscribe)
      )
      .subscribe(value => this.updateListByDid(value));
  }

  private updateListByDid(value: string): void {
    if (value) {
      this.dataSource.data = this._shadowList.filter((item) => item.id.includes(value));
    } else {
      this.dataSource.data = this._shadowList;
    }
  }

  private getAssetsIds(assets: Asset[]): string[] {
    return assets.map(asset => asset.id);
  }

  private assetListFactory(): Observable<AssetList[]> {
    if (this.listType === AssetListType.PREV_OWNED_ASSETS) {
      this.loadingService.show();
      return this.loadAssetList(
        this.iamService.assetsService.getPreviouslyOwnedAssets({owner: this.iamService.signerService.did})
      ).pipe(
        this.mapEnrolments()
      );
    } else if (this.listType === AssetListType.OFFERED_ASSETS) {
      this.loadingService.show();
      return this.loadAssetList(this.iamService.assetsService.getOfferedAssets())
        .pipe(
          this.mapEnrolments()
        );
    } else {
      this.store.dispatch(OwnedAssetsActions.getOwnedAssets());
      return this.store.select(OwnedAssetsSelectors.getOwnedAssets);
    }
  }

  private mapEnrolments() {
    return (source: Observable<Asset[]>) => {
      return source.pipe(
        switchMap((assets: Asset[]) => from(this.iamService.claimsService.getClaimsBySubjects(this.getAssetsIds(assets)))
          .pipe(
            map((claims) => claims.map(claim => claim.subject)),
            map(claims => assets.map((asset) => ({...asset, hasEnrolments: claims.includes(asset.id)})))
          )
        )
      );
    };
  }

  private _handleMessage(message: any) {
    if (message.type && (
      (this.listType === AssetListType.OFFERED_ASSETS &&
        (message.type === AssetHistoryEventType.ASSET_OFFERED ||
          message.type === AssetHistoryEventType.ASSET_OFFER_CANCELED)) ||
      (this.listType === AssetListType.MY_ASSETS &&
        (message.type === AssetHistoryEventType.ASSET_TRANSFERRED ||
          message.type === AssetHistoryEventType.ASSET_OFFER_REJECTED)) ||
      (this.listType === AssetListType.PREV_OWNED_ASSETS && message.type === AssetHistoryEventType.ASSET_TRANSFERRED)
    )) {
      this.getAssetList();
    }
  }

  private async _confirm(confirmationMsg: string, header: string) {
    return this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      maxHeight: '195px',
      data: {
        header,
        message: confirmationMsg
      },
      maxWidth: '100%',
      disableClose: true
    }).afterClosed().toPromise();
  }

  private loadAssetList(source: Promise<Asset[]> | Observable<Asset[]>) {
    return from(source)
      .pipe(
        map((assets) => assets.map((item: any) => {
            return ({
              ...item,
              createdDate: new Date(item.createdAt),
              modifiedDate: new Date(item.updatedAt)
            });
          })
        )
      );
  }
}
