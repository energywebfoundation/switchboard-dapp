export const iamServiceSpy = jasmine.createSpyObj('IamService', [
      'isSessionActive',
      'getDefinition',
      'getBalance',
      'getAddress',
      'getAssetById',
      'initializeConnection',
      'getOrgHistory',
      'isOwner',
      'wrapWithLoadingService',
      'getOrganizationsByOwner',
      'getUserClaims',
      'createSelfSignedClaim',
      'getENSTypesByOwner',
      'getDidDocument',
      'getPublicKey'
  ]
);
