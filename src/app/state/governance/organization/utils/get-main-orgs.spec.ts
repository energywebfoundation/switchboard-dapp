import { getMainOrgs } from './get-main-orgs';

describe('getMainOrgs', () => {
  it('should get only one main organizations', () => {
    const list = [
      {
        name: 'realsub',
        namespace: 'realsub.testorg.iam.ewc',
      },
      {
        name: 'testorg',
        namespace: 'testorg.iam.ewc',
        subOrgs: [
          {
            name: 'realsub',
            namespace: 'realsub.testorg.iam.ewc',
          },
          {
            name: 'suborg',
            namespace: 'suborg.testorg.iam.ewc',
          },
        ],
      },
      {
        name: 'secondsub',
        namespace: 'secondsub.realsub.testorg.iam.ewc',
      },
      {
        name: 'subsub',
        namespace: 'subsub.testorg.iam.ewc',
      },
    ];
    const result = getMainOrgs(list);
    expect(result.length).toBe(1);
    expect(result[0].name).toBe('testorg');
  });

  it('should get two main organizations', () => {
    const list = [
      {
        name: 'testorg',
        namespace: 'testorg.iam.ewc',
        subOrgs: [
          {
            name: 'realsub',
            namespace: 'realsub.testorg.iam.ewc',
          },
          {
            name: 'suborg',
            namespace: 'suborg.testorg.iam.ewc',
          },
        ],
      },
      {
        name: 'testorg1',
        namespace: 'testorg1.iam.ewc',
        subOrgs: [
          {
            name: 'realsub',
            namespace: 'realsub.testorg1.iam.ewc',
          },
          {
            name: 'suborg',
            namespace: 'suborg.testorg1.iam.ewc',
          },
        ],
      },
    ];

    const result = getMainOrgs(list);

    expect(result.length).toBe(2);
    expect(result[0].name).toBe('testorg');
    expect(result[1].name).toBe('testorg1');
  });

  it('should return empty list when gets empty list', () => {
    const result = getMainOrgs([]);

    expect(result.length).toBe(0);
  });
});
