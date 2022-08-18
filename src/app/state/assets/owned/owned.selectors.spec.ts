import * as OwnedSelectors from './owned.selectors';

describe('Owned Assets Selectors', () => {
  const asset: any = {
    id: 'did:ethr:0xc77dcA7fdC0bEA01D755349aA8C0b6EAb70907CA',
    owner: 'did:ethr:0xA028720Bc0cc22d296DCD3a26E7E8AAe73c9B6F3',
    createdAt: '2021-11-18T08:21:45.000Z',
    updatedAt: '2021-11-18T08:21:45.000Z',
  };
  describe('getOwnedAssets', () => {
    it('should return undefined when list of array is undefined', () => {
      expect(
        OwnedSelectors.getOwnedAssets.projector(undefined, {})
      ).toBeUndefined();
    });

    it('should return empty array when assets are empty', () => {
      expect(OwnedSelectors.getOwnedAssets.projector([], {})).toEqual([]);
    });

    it('should return array of assets with hasEnrolment property when claims are empty', () => {
      expect(OwnedSelectors.getOwnedAssets.projector([asset], {})).toEqual([
        {
          ...asset,
          hasEnrolments: true,
        } as any,
      ]);
    });

    it('should return array of assets updated by claims', () => {
      const assetClaim = {
        name: 'example',
        icon: 'https://url.com',
      };
      expect(
        OwnedSelectors.getOwnedAssets.projector([asset], {
          [asset.id]: assetClaim,
        })
      ).toEqual([
        {
          ...asset,
          ...assetClaim,
          hasEnrolments: true,
        } as any,
      ]);
    });
  });

  describe('getAssetsWithSelection', () => {
    it('should return all elements with isSelected set to false', () => {
      expect(
        OwnedSelectors.getAssetsWithSelection('123').projector({
          assets: [{ id: '321' }, { id: '111' }] as any[],
        })
      ).toEqual([
        { id: '321', isSelected: false },
        { id: '111', isSelected: false },
      ] as any[]);
    });

    it('should return one element with isSelected set to true', () => {
      expect(
        OwnedSelectors.getAssetsWithSelection('123').projector({
          assets: [{ id: '123' }, { id: '111' }] as any[],
        })
      ).toEqual([
        { id: '123', isSelected: true },
        { id: '111', isSelected: false },
      ] as any[]);
    });
  });
});
