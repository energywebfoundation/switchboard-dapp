import { Injectable } from '@angular/core';
import { IamService } from '../../../shared/services/iam.service';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { SubmissionRequirementMatch } from '@sphereon/pex';
import { ICredentialTableData } from '../models/credential-table-data.interface';
import { PresentationRequest } from '../models/presentation-request-data.interface';
@Injectable({
  providedIn: 'root',
})
export class PresentationService {
  constructor(private iamService: IamService) {}

  fetchPresentation(presentation: PresentationRequest) {
    return this.iamService.wrapWithLoadingService(
      this.iamService.verifiableCredentialsService.initiateExchange({
        type: presentation.type,
        url: presentation.url,
      })
    );
  }

  formatPresentationTableData(request): ICredentialTableData[] {
    const inputDescriptors =
      request?.vpRequest?.query[0]?.credentialQuery[0]?.presentationDefinition
        ?.input_descriptors;
    const selectResults = request?.selections[0]?.selectResults;
    // If the input descriptor is self-sign:
    const descriptors = inputDescriptors.map((desc) => {
      if (desc.constraints?.subject_is_issuer === 'required') {
        return { descriptor: desc.name, selfSign: true, descId: desc.id };
      }
      const descriptorMatches: number[] = selectResults?.matches
        ?.filter(
          (match: SubmissionRequirementMatch) => match.name === desc.name
        )
        .map((res) => {
          const regexMatch = res.vc_path
            ?.map((path: string) => path.match(/\d+/))
            .map((mtch) => parseInt(mtch[0]));
          return regexMatch[0];
        });
      const allMatchedCredentials = [];
      // Select credential at each index
      descriptorMatches.forEach((match: number) => {
        allMatchedCredentials.push({
          role: selectResults?.verifiableCredential[match]?.credentialSubject
            ?.role?.namespace,
          credential: selectResults?.verifiableCredential[match],
          descriptor: desc.id,
        });
      });
      // Create table data with descriptor name and all matched credentials.
      return {
        descriptor: desc.name,
        credentials: allMatchedCredentials,
        selfSign: false,
        descId: desc.id,
      };
    });
    return descriptors;
  }
}
