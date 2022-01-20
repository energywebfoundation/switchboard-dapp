import * as TypeMoq from "typemoq";
import { getOrgHierarchy } from './get-org-hierarchy';
import { OrganizationProvider } from '../models/organization-provider.interface';

describe('getOrgHierarchy', () => {
  it('should return the same list when organization is undefined', () => {
    const result = getOrgHierarchy([
      {
        'name': 'secondsub',
        'namespace': 'secondsub.realsub.testorg.iam.ewc',
      },
      {
        'name': 'subsub',
        'namespace': 'subsub.testorg.iam.ewc',
      }] as any, undefined);

    expect(result.length).toBe(2);
  });

  it('should add new element to the hierarchy', () => {
    const result = getOrgHierarchy([
        {
          'name': 'secondsub',
          'namespace': 'secondsub.realsub.testorg.iam.ewc',
        },
        {
          'name': 'subsub',
          'namespace': 'subsub.testorg.iam.ewc',
        }] as any,
      {
        'name': 'test',
        'namespace': 'test.testorg.iam.ewc',
      } as any);

    expect(result.length).toBe(3);
  });

  it('should remove last element from hierarchy', () => {
    const secondSubMock = TypeMoq.Mock.ofType<OrganizationProvider>();
    secondSubMock.object.name = 'secondsub';
    secondSubMock.object.namespace = 'secondsub.realsub.testorg.iam.ewc';
    const subsubMock = TypeMoq.Mock.ofType<OrganizationProvider>();
    subsubMock.object.name = 'subsub';
    subsubMock.object.namespace = 'subsub.testorg.iam.ewc';

    const result = getOrgHierarchy([secondSubMock.object, subsubMock.object], secondSubMock.object);
    expect(result.length).toBe(1);
  });
});
