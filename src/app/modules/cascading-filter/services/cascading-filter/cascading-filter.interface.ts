import { FilterStatus } from '../../../../routes/enrolment/enrolment-list/models/filter-status.enum';

export interface ICascadingFilter {
  namespace: string;
  organization?: string;
  roleName?: string;
  application?: string;
  subject?: string;
  requester?: string;
  status?: FilterStatus;
}
