import { EnrolmentListType } from '../../../models/enrolment-list-type.enum';
import { IssuerRequestsComponent } from '../../../../view-requests/issuer-requests/issuer-requests.component';
import { ViewRequestsComponent } from '../../../../view-requests/view-requests.component';

export const GetPreviewComponent = new Map()
  .set(EnrolmentListType.ISSUER, IssuerRequestsComponent)
  .set(EnrolmentListType.ASSET, ViewRequestsComponent)
  .set(EnrolmentListType.APPLICANT, ViewRequestsComponent)
  .set(EnrolmentListType.REVOKER, ViewRequestsComponent);
