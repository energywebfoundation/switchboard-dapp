import { getAsset, getAssetDetails } from './asset-details.selectors';

describe('Asset Details Selectors', () => {
  describe('getAsset selector', () => {
    it('should return undefined when passing empty object', () => {
      expect(getAsset.projector({})).toBeUndefined();
    });

    it('should return object when passing object containing asset', () => {
      expect(getAsset.projector({ asset: {} })).toEqual({});
    });
  });

  describe('getAssetDetails selector', () => {
    it('should return undefined when asset and claims are undefined', () => {
      expect(getAssetDetails.projector(undefined, undefined)).toEqual({});
    });

    it('should return empty object when asset is undefined', () => {
      const assetClaim = { '1': { name: '', icon: '' } };
      expect(getAssetDetails.projector(undefined, assetClaim)).toEqual({});
    });

    it('should return asset when claim is undefined', () => {
      const asset = { id: '' };
      expect(getAssetDetails.projector(asset, undefined)).toEqual(asset);
    });

    it('should return concatenated asset and asset claim', () => {
      const asset = { id: '1' };
      const claim = { '1': { name: '' } };

      expect(getAssetDetails.projector(asset, claim)).toEqual({
        ...asset,
        ...claim['1'],
      });
    });
  });
});
