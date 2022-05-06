import { removeAssetsFromList } from './remove-assets-from-list';

describe('removeAssetsFromList', () => {
  it('should remove asset from list', () => {
    const assetEnrolment: any = {
      subject: 'subject',
      claimType: 'claimType',
      requester: 'requester',
    };
    expect(removeAssetsFromList([assetEnrolment])).toEqual([]);
  });

  it('should return the same list when there is no asset claim', () => {
    const enrolment: any = {
      subject: 'notAsset',
      claimType: 'notAsset',
    };
    expect(removeAssetsFromList([enrolment])).toEqual([enrolment]);
  });
});
