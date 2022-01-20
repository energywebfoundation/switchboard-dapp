import { getOrgHierarchy } from './get-org-hierarchy';

describe('getOrgHierarchy', () => {
  it('should return the same list when organization is undefined', () => {
    const result = getOrgHierarchy(
      [
        {
          name: 'secondsub',
          namespace: 'secondsub.realsub.testorg.iam.ewc',
        },
        {
          name: 'subsub',
          namespace: 'subsub.testorg.iam.ewc',
        },
      ] as any,
      undefined
    );

    expect(result.length).toBe(2);
  });

  it('should add new element to the hierarchy', () => {
    const result = getOrgHierarchy(
      [
        {
          name: 'secondsub',
          namespace: 'secondsub.realsub.testorg.iam.ewc',
        },
        {
          name: 'subsub',
          namespace: 'subsub.testorg.iam.ewc',
        },
      ] as any,
      {
        name: 'test',
        namespace: 'test.testorg.iam.ewc',
      } as any
    );

    expect(result.length).toBe(3);
  });

  it('should remove last element from hierarchy', () => {
    const result = getOrgHierarchy(
      [
        {
          name: 'secondsub',
          namespace: 'secondsub.realsub.testorg.iam.ewc',
        },
        {
          name: 'subsub',
          namespace: 'subsub.testorg.iam.ewc',
        },
      ] as any,
      {
        name: 'secondsub',
        namespace: 'secondsub.realsub.testorg.iam.ewc',
      } as any
    );
    expect(result.length).toBe(1);
  });
});
