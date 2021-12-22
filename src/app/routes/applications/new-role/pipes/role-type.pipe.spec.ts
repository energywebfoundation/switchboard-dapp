import { RoleTypePipe } from './role-type.pipe';
import { RoleTypeEnum } from '../new-role.component';

describe('RoleTypePipe', () => {
  let pipe: RoleTypePipe;

  beforeEach(() => {
    pipe = new RoleTypePipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return application when type is app', () => {
    expect(pipe.transform(RoleTypeEnum.APP)).toEqual('Application');
  });

  it('should return organization when type is org', () => {
    expect(pipe.transform(RoleTypeEnum.ORG)).toEqual('Organization');
  });
});
