import { EnrolmentClaim } from '../../../../routes/enrolment/models/enrolment-claim';

export const isAsset = (element: EnrolmentClaim) => {
  return (
    element?.subject !== element?.claimType &&
    element?.subject !== element?.requester
  );
};

export const removeAssetsFromList = (list: EnrolmentClaim[]) => {
  return list.filter((item) => !isAsset(item));
};
