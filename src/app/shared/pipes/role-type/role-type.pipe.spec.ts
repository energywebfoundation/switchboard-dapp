import { RoleTypePipe } from './role-type.pipe';
import { RoleTypeEnum } from '../../../routes/applications/new-role/new-role.component';

describe('RoleTypePipe', () => {
  let pipe: RoleTypePipe;

  beforeEach(() => {
    pipe = new RoleTypePipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should check if return Application', () => {
    expect(pipe.transform(RoleTypeEnum.APP)).toEqual('Application');
  });

  it('should check if return Organization', () => {
    expect(pipe.transform(RoleTypeEnum.ORG)).toEqual('Organization');
  });

  it('should check if return Custom', () => {
    expect(pipe.transform(RoleTypeEnum.CUSTOM)).toEqual('Custom');
  });

  it('should check if return Custom', () => {
    expect(pipe.transform('Something' as RoleTypeEnum)).toEqual(
      'Unsupported Role Type'
    );
  });
});
