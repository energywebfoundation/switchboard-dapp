import { ViewType } from './view-type.enum';
import { AppDomain } from './app-domain.interface';

export interface ApplicationData extends AppDomain {
  viewType: ViewType;
}
