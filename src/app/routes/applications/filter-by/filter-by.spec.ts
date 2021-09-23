import { filterBy } from './filter-by';
import { ENSNamespaceTypes } from 'iam-client-lib';

describe('filterBy organization/application/role', () => {
  it('should filter by organization and should find an element', () => {
    const data = [{namespace: 'test.iam.ewc'}];
    expect(filterBy(data, 'test', '', '')).toEqual(data);
  });

  it('should return empty array if filtered organization do not exist on the list', () => {
    const data = [{namespace: 'ttt.iam.ewc'}];
    expect(filterBy(data, 'test', '', '')).toEqual([]);
  });

  it('should find an element after filtering by application', () => {
    const data = [{namespace: `testapp.${ENSNamespaceTypes.Application}.test.iam.ewc`}];
    expect(filterBy(data, '', 'testapp', '')).toEqual(data);
  });

  it('should return empty array if filtered application do not exist on the list', () => {
    const data = [{namespace: `testapp.${ENSNamespaceTypes.Application}.test.iam.ewc`}];
    expect(filterBy(data, '', '123', '')).toEqual([]);
  });

  it('should find an element after filtering by organization role', () => {
    const data = [{namespace: `testrole.${ENSNamespaceTypes.Roles}.test.iam.ewc`}];
    expect(filterBy(data, '', '', 'testrole')).toEqual(data);
  });

  it('should return empty array if filtered role do not exist on the list', () => {
    const data = [{namespace: `testrole.${ENSNamespaceTypes.Roles}.test1.iam.ewc`}];
    expect(filterBy(data, '', '', 'test1')).toEqual([]);
  });

  it('should filter at once through organization, application and role', () => {
    const data = [
      {namespace: 'test.iam.ewc'},
      {namespace: `testrole.${ENSNamespaceTypes.Roles}.ttt.iam.ewc`},
      {namespace: `testapp.${ENSNamespaceTypes.Application}.abc.iam.ewc`},
      {namespace: `rolapp.${ENSNamespaceTypes.Roles}.testapp.${ENSNamespaceTypes.Application}.dsa.iam.ewc`}
    ];

    expect(filterBy(data, 'test', '', '')).toEqual([{namespace: 'test.iam.ewc'}]);
    expect(filterBy(data, 'abc', 'test', '')).toEqual([{namespace: `testapp.${ENSNamespaceTypes.Application}.abc.iam.ewc`}]);
    expect(filterBy(data, 't', '', 'role')).toEqual([{namespace: `testrole.${ENSNamespaceTypes.Roles}.ttt.iam.ewc`}]);
    expect(filterBy(data, 'dsa', 'testapp', 'rola')).toEqual([{namespace: `rolapp.${ENSNamespaceTypes.Roles}.testapp.${ENSNamespaceTypes.Application}.dsa.iam.ewc`}]);
  });
});
