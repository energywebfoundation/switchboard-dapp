import { Injectable } from '@angular/core';
import { IamService } from '../../../shared/services/iam.service';
import { SwitchboardToastrService } from '../../../shared/services/switchboard-toastr.service';
import { LoadingService } from '../../../shared/services/loading.service';

@Injectable({
  providedIn: 'root'
})
export class StakingPoolService {

  constructor(private iamService: IamService,
              private sbToastr: SwitchboardToastrService,
              private loadingService: LoadingService) { }
}
