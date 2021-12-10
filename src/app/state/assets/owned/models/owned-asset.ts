import { Asset } from 'iam-client-lib';

export interface OwnedAsset extends Asset {
  createdDate: Date;
  modifiedDate: Date;
  createdAt: string;
  updatedAt: string;
}
