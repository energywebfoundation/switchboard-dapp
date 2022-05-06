import { EnrolmentClaim } from '../../../../routes/enrolment/models/enrolment-claim.interface';

export const removeAssetsFromList = (list: EnrolmentClaim[]) => {
  const isAsset = (element: EnrolmentClaim) => {
    return (
      element?.subject !== element?.claimType &&
      element?.subject !== element?.requester
    );
  };

  return list.filter((item) => !isAsset(item));
};
