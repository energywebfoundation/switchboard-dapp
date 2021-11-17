import { preconditionCheck } from './precondition-check';
import { RolePreconditionType } from '../models/role-precondition-type.enum';

describe('Test preconditionCheck', () => {
  it('should return empty list of preconditions and true', () => {
    expect(preconditionCheck(
      [{type: 'role', 'conditions': []}], [])).toEqual([true, []]);
  });

  it('should return false and element with status pending ', () => {
    expect(preconditionCheck(
      [{type: 'role', 'conditions': ['condition']}], [])).toEqual([false, [{
      namespace: 'condition',
      status: RolePreconditionType.PENDING
    }]]);
  });

  it('should return true and element with status synced ', () => {
    expect(preconditionCheck(
      [{type: 'role', 'conditions': ['condition']}], [{
        isAccepted: true,
        isRejected: false,
        isSynced: true,
        claimType: 'condition'
      }] as any[])).toEqual([true, [{
      namespace: 'condition',
      status: RolePreconditionType.SYNCED
    }]]);
  });

  it('should return false and element with status approved ', () => {
    expect(preconditionCheck(
      [{type: 'role', 'conditions': ['condition']}], [{
        isAccepted: true,
        isRejected: false,
        isSynced: false,
        claimType: 'condition'
      }] as any[])).toEqual([false, [{
      namespace: 'condition',
      status: RolePreconditionType.APPROVED
    }]]);
  });

});
