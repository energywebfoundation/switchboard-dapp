import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog, MatSort, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { Asset, AssetHistoryEventType } from 'iam-client-lib';
import { ToastrService } from 'ngx-toastr';
import { CancelButton } from 'src/app/layout/loading/loading.component';
import { AssetListType } from 'src/app/shared/constants/shared-constants';
import { IamService } from 'src/app/shared/services/iam.service';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { TransferOwnershipComponent } from '../../applications/transfer-ownership/transfer-ownership.component';
import { ConfirmationDialogComponent } from '../../widgets/confirmation-dialog/confirmation-dialog.component';
import { AssetOwnershipHistoryComponent } from '../asset-ownership-history/asset-ownership-history.component';
import { EditAssetDialogComponent } from '../edit-asset-dialog/edit-asset-dialog.component';
import { finalize, first, flatMap, map, switchMap, tap } from 'rxjs/operators';
import { forkJoin, from, Observable } from 'rxjs';

export const RESET_LIST = true;

const HEADER_TRANSFER_OWNERSHIP = 'Transfer Ownership';
const HEADER_CANCEL_OWNERSHIP = 'Cancel Offered Ownership';
const HEADER_ACCEPT_OWNERSHIP = 'Accept Offered Asset';
const HEADER_REJECT_OWNERSHIP = 'Reject Offered Asset';

@Component({
  selector: 'app-asset-list',
  templateUrl: './asset-list.component.html',
  styleUrls: ['./asset-list.component.scss']
})
export class AssetListComponent implements OnInit, OnDestroy {
  @Input('list-type') listType: number;
  @ViewChild(MatSort, undefined) sort: MatSort;
  @Output() selectTab = new EventEmitter<any>();

  AssetListType = AssetListType;

  dataSource: MatTableDataSource<Asset> = new MatTableDataSource([]);
  displayedColumns: string[] = ['logo', 'createdDate', 'name', 'id'];

  private _iamSubscriptionId: number;

  constructor(private toastr: ToastrService,
              private dialog: MatDialog,
              private iamService: IamService,
              private notifService: NotificationService,
              private loadingService: LoadingService,
              private route: Router) {

  }

  async ngOnDestroy(): Promise<void> {
    // Unsubscribe from IAM Events
    await this.iamService.iam.unsubscribeFrom(this._iamSubscriptionId);
  }

  async ngOnInit(): Promise<void> {
    // Subscribe to IAM events
    this._iamSubscriptionId = await this.iamService.iam.subscribeTo({
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
      await this.getAssetList(RESET_LIST);
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
  }

  async getAssetList(resetList?: boolean) {
    if (!resetList) {
      return;
    }
    this.loadingService.show();
    this.subscribeTo(this.assetListFactory());
  }

  subscribeTo(source: Observable<Asset[]>) {
    return source.pipe(
      finalize(() => this.loadingService.hide())
    ).subscribe((data: Asset[]) => {
      this.dataSource.data = data;
    }, error => {
      console.error(error);
      this.toastr.error(error.message || 'Could not retrieve list. Please contact system administrator.');
    });
  }

  transferOwnership(type: any, data: Asset) {
    const dialogRef = this.dialog.open(TransferOwnershipComponent, {
      width: '600px', data: {
        assetDid: data.id,
        type: type,
        owner: data.owner
      },
      maxWidth: '100%',
      disableClose: true
    }).afterClosed().subscribe((res: any) => {
      if (res) {
        this.toastr.success('Asset is offered successfully.', HEADER_TRANSFER_OWNERSHIP);
        this.getAssetList(RESET_LIST);
      }
      dialogRef.unsubscribe();
    });
  }

  async cancelAssetOffer(data: Asset) {
    if (await this._confirm('The offered ownership of this asset will be cancelled.', HEADER_CANCEL_OWNERSHIP)) {
      try {
        this.loadingService.show('Please confirm this transaction in your connected wallet.', CancelButton.ENABLED);
        await this.iamService.iam.cancelAssetOffer({
          assetDID: data.id
        });
        this.toastr.success('Offered ownership is cancelled successfully.', HEADER_CANCEL_OWNERSHIP);
        await this.getAssetList(RESET_LIST);
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
        await this.iamService.iam.acceptAssetOffer({
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
        await this.iamService.iam.rejectAssetOffer({
          assetDID: data.id
        });
        this.toastr.success('You have rejected an offered asset successfully.', HEADER_REJECT_OWNERSHIP);
        await this.getAssetList(RESET_LIST);
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

  viewAssetEnrolments(data: Asset) {
    this.route.navigate(['assets/enrolment/' + data.id]);
  }

  edit(data: Asset) {
    const dialogRef = this.dialog.open(EditAssetDialogComponent, {
      width: '600px',
      data,
      maxWidth: '100%',
    });

    this.subscribeTo(dialogRef.afterClosed().pipe(
      first(),
      tap(() => this.loadingService.show()),
      switchMap(() => this.assetListFactory())
    ));
  }

  private getAssetsWithClaims() {
    return forkJoin(
      from(
        this.iamService.iam.getUserClaims()).pipe(
        flatMap((claimsData) => claimsData.filter(claim => !!claim.profile)),
        map(claim => claim.profile && claim.profile),
      ),
      this.loadAssetList(this.iamService.iam.getOwnedAssets())
    ).pipe(
      map(([profile, assets]) => this.addClaimData(profile, assets))
    );
  }

  private assetListFactory(): Observable<Asset[]> {
    if (this.listType === AssetListType.PREV_OWNED_ASSETS) {
      return this.loadAssetList(this.iamService.iam.getPreviouslyOwnedAssets({ owner: this.iamService.iam.getDid() }));
    } else if (this.listType === AssetListType.OFFERED_ASSETS) {
      return this.loadAssetList(this.iamService.iam.getOfferedAssets());
    } else {
      return this.getAssetsWithClaims();
    }
  }

  private addClaimData(profile, assets) {
    return assets.map((asset) => ({ ...asset, ...(profile && profile.assetProfiles && profile.assetProfiles[asset.id]) }));
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
      this.getAssetList(RESET_LIST);
    }
  }

  private async _confirm(confirmationMsg: string, header: string) {
    return this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      maxHeight: '195px',
      data: {
        header: header,
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
