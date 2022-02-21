import { DomainTypePipe } from './domain-type.pipe';
import { DomainTypeEnum } from '../../../routes/applications/new-role/new-role.component';

describe('DomainTypePipe', () => {
  let pipe: DomainTypePipe;

  beforeEach(() => {
    pipe = new DomainTypePipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should check if return Application', () => {
    expect(pipe.transform(DomainTypeEnum.APP)).toEqual('Application');
  });

  it('should check if return Organization', () => {
    expect(pipe.transform(DomainTypeEnum.ORG)).toEqual('Organization');
  });

  it('should check if return Custom', () => {
    expect(pipe.transform(DomainTypeEnum.CUSTOM)).toEqual('Custom');
  });

  it('should check if return Custom', () => {
    expect(pipe.transform('Something' as DomainTypeEnum)).toEqual(
      'Unsupported Domain Type'
    );
  });
});
