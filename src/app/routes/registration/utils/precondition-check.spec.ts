import { preconditionCheck } from './precondition-check';
import { RolePreconditionType } from '../models/role-precondition-type.enum';
import { PreconditionType } from 'iam-client-lib';

describe('Test preconditionCheck', () => {
  it('should return true when preconditions is an empty list', () => {
    expect(preconditionCheck([], [])).toEqual([true, []]);
  });

  it('should return empty list of preconditions and true', () => {
    expect(
      preconditionCheck([{ type: PreconditionType.Role, conditions: [] }], [])
    ).toEqual([true, []]);
  });

  it('should return false and element with status pending ', () => {
    expect(
      preconditionCheck(
        [{ type: PreconditionType.Role, conditions: ['condition'] }],
        []
      )
    ).toEqual([
      false,
      [
        {
          conditionNamespace: 'condition',
          status: RolePreconditionType.PENDING,
        },
      ],
    ]);
  });

  it('should return true and element with status synced ', () => {
    expect(
      preconditionCheck(
        [{ type: PreconditionType.Role, conditions: ['condition'] }],
        [
          {
            isAccepted: true,
            isRejected: false,
            isSynced: true,
            claimType: 'condition',
          },
        ] as any[]
      )
    ).toEqual([
      true,
      [
        {
          conditionNamespace: 'condition',
          status: RolePreconditionType.SYNCED,
        },
      ],
    ]);
  });

  it('should return false and element with status approved ', () => {
    expect(
      preconditionCheck(
        [{ type: PreconditionType.Role, conditions: ['condition'] }],
        [
          {
            isAccepted: true,
            isRejected: false,
            isSynced: false,
            claimType: 'condition',
          },
        ] as any[]
      )
    ).toEqual([
      false,
      [
        {
          conditionNamespace: 'condition',
          status: RolePreconditionType.APPROVED,
        },
      ],
    ]);
  });

  it('should return false and element with status pending ', () => {
    expect(
      preconditionCheck(
        [{ type: PreconditionType.Role, conditions: ['condition'] }],
        [
          {
            isAccepted: false,
            isRejected: false,
            isSynced: false,
            claimType: 'condition',
          },
        ] as any[]
      )
    ).toEqual([
      false,
      [
        {
          conditionNamespace: 'condition',
          status: RolePreconditionType.PENDING,
        },
      ],
    ]);
  });
});
