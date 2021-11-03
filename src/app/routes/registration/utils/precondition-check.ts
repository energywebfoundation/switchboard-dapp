import { PreconditionTypes } from 'iam-client-lib';
import { RolePreconditionType } from '../request-claim/request-claim.component';
import { Claim } from 'iam-client-lib/dist/src/cacheServerClient/cacheServerClient.types';

export interface EnrolmentPrecondition {
  type: string,
  conditions: string[];
}

export interface PreconditionCheck {
  namespace: string;
  status: RolePreconditionType;
}

export const preconditionCheck = (preconditionList: EnrolmentPrecondition[], roleList: Claim[]): [boolean, PreconditionCheck[]] => {
  let retVal = true;
  let rolePreconditionList: PreconditionCheck[];
  if (preconditionList && preconditionList.length) {
    for (const precondition of preconditionList) {
      switch (precondition.type) {
        case PreconditionTypes.Role:
          // Check for Role Conditions
          rolePreconditionList = [];

          const conditions = precondition.conditions;
          if (conditions) {
            for (const roleCondition of conditions) {
              const status = getRoleConditionStatus(roleCondition, roleList);
              rolePreconditionList.push({
                namespace: roleCondition,
                status
              });

              if (status !== RolePreconditionType.SYNCED) {
                retVal = false;
              }
            }
          }
          break;
      }
    }
  }

  return [retVal, rolePreconditionList];
};

const getRoleConditionStatus = (namespace: string, roleList) => {
  let status = RolePreconditionType.PENDING;

  // Check if namespace exists in synced DID Doc Roles
  for (const roleObj of roleList) {
    if (roleObj.claimType === namespace) {
      if (roleObj.isAccepted) {
        if (roleObj.isSynced) {
          status = RolePreconditionType.SYNCED;
        } else {
          status = RolePreconditionType.APPROVED;
        }
      }
      break;
    }
  }

  return status;
};
