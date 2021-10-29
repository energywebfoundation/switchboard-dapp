import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { IamService } from '../../../shared/services/iam.service';

@Injectable({
  providedIn: 'root'
})
export class IssuanceVcService {

  constructor(private iamService: IamService) {
  }

  create(data: { subject: string, claim: any }) {
    this.iamService.issueClaim(data);
  }

  getIssuerRoles() {
    return of([
      {
        'id': 464,
        'name': 'aaa1',
        'namespace': 'aaa1.roles.dawidgil.iam.ewc',
        'namehash': '0xd1fcd83a68e017536a77f59e13b5cebdf52624a7f65cbbab59e2670c204d9d3c',
        'owner': '0xA028720Bc0cc22d296DCD3a26E7E8AAe73c9B6F3',
        'definition': {
          'fields': [],
          'issuer': {
            'did': [
              'did:ethr:0xA028720Bc0cc22d296DCD3a26E7E8AAe73c9B6F3'
            ],
            'issuerType': 'DID'
          },
          'version': 1,
          'metadata': {},
          'roleName': 'aaa1',
          'roleType': 'org',
          'enrolmentPreconditions': [
            {
              'type': 'role',
              'conditions': [
                '',
                ''
              ]
            }
          ]
        }
      },
      {
        'id': 397,
        'name': 'required1',
        'namespace': 'required1.roles.dawidgil.iam.ewc',
        'namehash': '0xa7e4000426c80be13f0b80a520e79ba6b1072dc1d401874b315793e2aaaeec93',
        'owner': '0xA028720Bc0cc22d296DCD3a26E7E8AAe73c9B6F3',
        'definition': {
          'fields': [
            {
              'label': 'date',
              'maxDate': '2021-06-12T22:00:00.000Z',
              'minDate': '2015-12-31T23:00:00.000Z',
              'required': true,
              'fieldType': 'date'
            },
            {
              'label': 'date not required',
              'maxDate': null,
              'minDate': null,
              'required': null,
              'fieldType': 'date'
            }
          ],
          'issuer': {
            'did': [
              'did:ethr:0xA028720Bc0cc22d296DCD3a26E7E8AAe73c9B6F3'
            ],
            'issuerType': 'DID'
          },
          'version': 1,
          'metadata': {},
          'roleName': 'required1',
          'roleType': 'org',
          'enrolmentPreconditions': []
        }
      },
      {
        'id': 507,
        'name': '435435',
        'namespace': '435435.roles.dawidgil.iam.ewc',
        'namehash': '0x005a495d8ffc246a5029f40376ef4a05f7171a88e50db2985470cca0df2a4253',
        'owner': '0xA028720Bc0cc22d296DCD3a26E7E8AAe73c9B6F3',
        'definition': {
          'fields': [],
          'issuer': {
            'did': [
              'did:ethr:0xA028720Bc0cc22d296DCD3a26E7E8AAe73c9B6F3'
            ],
            'issuerType': 'DID'
          },
          'version': 1,
          'metadata': {},
          'roleName': '435435',
          'roleType': 'org',
          'enrolmentPreconditions': []
        }
      },
      {
        'id': 376,
        'name': 'role2',
        'namespace': 'role2.roles.dawidgil.iam.ewc',
        'namehash': '0x23c3daef5285fcdd100a8be577093fcac580d6f516893ce0adc6e11db2e08526',
        'owner': '0xA028720Bc0cc22d296DCD3a26E7E8AAe73c9B6F3',
        'definition': {
          'fields': [],
          'issuer': {
            'did': [
              'did:ethr:0xA028720Bc0cc22d296DCD3a26E7E8AAe73c9B6F3'
            ],
            'issuerType': 'DID'
          },
          'version': 2,
          'metadata': {},
          'roleName': 'role2',
          'roleType': 'org',
          'enrolmentPreconditions': [
            {
              'type': 'role',
              'conditions': [
                ''
              ]
            }
          ]
        }
      }
    ]);
  }
}
