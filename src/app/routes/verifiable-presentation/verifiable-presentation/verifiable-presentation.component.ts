import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { IamService } from "../../../shared/services/iam.service";
import { IOOBPresentation } from '../models/out-of-band-presentation.interface';
import { LoadingService } from '../../../shared/services/loading.service';

@Component({
    selector: 'app-verifiable-presentation',
    templateUrl: './verifiable-presentation.component.html',
    styleUrls: ['./verifiable-presentation.component.scss']
})
export class VerifiablePresentationComponent implements OnInit {
    oob$: Observable<string>

    constructor(
        private route: ActivatedRoute,
        private loadingService: LoadingService
    ) { }
    isAutolistLoading = {
        requests: [],
        value: false,
      };
        //logic to decode the presentation
        ngOnInit(): void {
            this._initSearch()
    
        }
 
    private _initSearch() {
        this.route.queryParams.subscribe(async (params: any) => {
            this.loadingService.show()
            if (params._oob) {
                const paramsDecoded = atob(params._oob);
                const parsedToObj = JSON.parse(paramsDecoded)
                this.loadingService.hide();
                //Send decoded params to IAM client lib
            }
          this.loadingService.hide();
        })
    }
}
