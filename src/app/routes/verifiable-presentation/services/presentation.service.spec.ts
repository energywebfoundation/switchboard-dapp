import { TestBed } from '@angular/core/testing';

import { PresentationService } from './presentation.service';
import { IamService } from '../../../shared/services/iam.service';
import { iamServiceSpy } from '@tests';
import { ICredentialTableData } from '../models/credential-table-data.interface';

describe('PresentationService', () => {
  let service: PresentationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: IamService, useValue: iamServiceSpy }],
    });
    service = TestBed.inject(PresentationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should format table data correctly', () => {
    const data = {
      vpRequest: {
        challenge: '0e21c644-f3ff-4f7e-8db8-16811a9f28ff',
        query: [
          {
            type: 'PresentationDefinition',
            credentialQuery: [
              {
                presentationDefinition: {
                  id: 'did:ethr:blxm-dev:0xE4Be3f152D742D9801F0897EC6386D128BC7a335',
                  input_descriptors: [
                    {
                      id: 'energy_supplier_customer_contract',
                      name: 'Energy Supplier Customer Contract',
                      purpose:
                        'An energy supplier contract is needed for Rebeam authorization',
                      constraints: {
                        fields: [
                          {
                            path: ['$.credentialSubject.role.namespace'],
                            filter: {
                              type: 'string',
                              const:
                                'customer.roles.rebeam.apps.eliagroup.iam.ewc',
                            },
                          },
                        ],
                      },
                    },
                    {
                      id: 'charging_data',
                      name: 'Data needs to be signed by the user',
                      purpose:
                        'Data needs to be signed by the user to start the charging',
                      constraints: {
                        subject_is_issuer: 'required',
                        fields: [
                          {
                            path: [
                              '$.credentialSubject.chargingData.contractDID',
                            ],
                            filter: {
                              type: 'string',
                              const:
                                'did:ethr:blxm-dev:0xE4Be3f152D742D9801F0897EC6386D128BC7a335',
                            },
                          },
                          {
                            path: ['$.credentialSubject.chargingData.evseId'],
                            filter: { type: 'string', const: '892' },
                          },
                          {
                            path: [
                              '$.credentialSubject.chargingData.timeStamp',
                            ],
                            filter: {
                              type: 'string',
                              const: '2022-06-09T10:11:03.779Z',
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
          },
        ],
        interact: {
          service: [
            {
              type: 'UnmediatedHttpPresentationService2021',
              serviceEndpoint:
                'https://vc-api-dev.energyweb.org/vc-api/exchanges/did:ethr:blxm-dev:0xE4Be3f152D742D9801F0897EC6386D128BC7a335/c5611b11-a708-4c84-af19-ee67f0f2cba1',
            },
          ],
        },
      },
      selections: [
        {
          presentationDefinition: {
            id: 'did:ethr:blxm-dev:0xE4Be3f152D742D9801F0897EC6386D128BC7a335',
            input_descriptors: [
              {
                id: 'energy_supplier_customer_contract',
                name: 'Energy Supplier Customer Contract',
                purpose:
                  'An energy supplier contract is needed for Rebeam authorization',
                constraints: {
                  fields: [
                    {
                      path: ['$.credentialSubject.role.namespace'],
                      filter: {
                        type: 'string',
                        const: 'customer.roles.rebeam.apps.eliagroup.iam.ewc',
                      },
                    },
                  ],
                },
              },
              {
                id: 'charging_data',
                name: 'Data needs to be signed by the user',
                purpose:
                  'Data needs to be signed by the user to start the charging',
                constraints: {
                  subject_is_issuer: 'required',
                  fields: [
                    {
                      path: ['$.credentialSubject.chargingData.contractDID'],
                      filter: {
                        type: 'string',
                        const:
                          'did:ethr:blxm-dev:0xE4Be3f152D742D9801F0897EC6386D128BC7a335',
                      },
                    },
                    {
                      path: ['$.credentialSubject.chargingData.evseId'],
                      filter: { type: 'string', const: '892' },
                    },
                    {
                      path: ['$.credentialSubject.chargingData.timeStamp'],
                      filter: {
                        type: 'string',
                        const: '2022-06-09T10:11:03.779Z',
                      },
                    },
                  ],
                },
              },
            ],
          },
          selectResults: {
            errors: [
              {
                tag: 'FilterEvaluation',
                status: 'error',
                message:
                  'Input candidate does not contain property: $.input_descriptors[1]: $[0]',
              },
              {
                tag: 'FilterEvaluation',
                status: 'error',
                message:
                  'Input candidate does not contain property: $.input_descriptors[1]: $[0]',
              },
              {
                tag: 'FilterEvaluation',
                status: 'error',
                message:
                  'Input candidate does not contain property: $.input_descriptors[1]: $[0]',
              },
              {
                tag: 'MarkForSubmissionEvaluation',
                status: 'error',
                message:
                  'The input candidate is not eligible for submission: $.input_descriptors[1]: $[0]',
              },
            ],
            matches: [
              {
                name: 'Energy Supplier Customer Contract',
                rule: 'all',
                vc_path: ['$.verifiableCredential[0]'],
              },
            ],
            areRequiredCredentialsPresent: 'info',
            verifiableCredential: [
              {
                id: 'urn:uuid:88dbacbe-97b1-4a9d-9eff-0a72ca9d85a5',
                type: ['VerifiableCredential', 'EWFRole'],
                proof: {
                  type: 'EthereumEip712Signature2021',
                  created: '2022-06-01T09:13:21.022Z',
                  '@context':
                    'https://w3id.org/security/suites/eip712sig-2021/v1',
                  proofValue:
                    '0xd3d66b7b310f6da0813cf5c6c9a1b59b160fe06f81701b337ce17a63b931a2cf30c67d7b4f902f19d3e75f1e3a48af5accd593c09ec6df5b2f5c289a348b4e581b',
                  eip712Domain: {
                    domain: {},
                    primaryType: 'VerifiableCredential',
                    messageSchema: {
                      Proof: [
                        { name: '@context', type: 'string' },
                        { name: 'verificationMethod', type: 'string' },
                        { name: 'created', type: 'string' },
                        { name: 'proofPurpose', type: 'string' },
                        { name: 'type', type: 'string' },
                      ],
                      EWFRole: [
                        { name: 'namespace', type: 'string' },
                        { name: 'version', type: 'string' },
                      ],
                      EIP712Domain: [],
                      IssuerFields: [
                        { name: 'key', type: 'string' },
                        { name: 'value', type: 'string' },
                      ],
                      CredentialSubject: [
                        { name: 'id', type: 'string' },
                        { name: 'role', type: 'EWFRole' },
                        { name: 'issuerFields', type: 'IssuerFields[]' },
                      ],
                      VerifiableCredential: [
                        { name: '@context', type: 'string[]' },
                        { name: 'id', type: 'string' },
                        { name: 'type', type: 'string[]' },
                        { name: 'issuer', type: 'string' },
                        { name: 'issuanceDate', type: 'string' },
                        {
                          name: 'credentialSubject',
                          type: 'CredentialSubject',
                        },
                        { name: 'proof', type: 'Proof' },
                      ],
                    },
                  },
                  proofPurpose: 'assertionMethod',
                  verificationMethod:
                    'did:ethr:0x012047:0x2670a5f431f0b444329db18b3bd07ccfe6bf4cf3#controller',
                },
                issuer:
                  'did:ethr:0x012047:0x2670a5f431f0b444329db18b3bd07ccfe6bf4cf3',
                '@context': ['https://www.w3.org/2018/credentials/v1'],
                issuanceDate: '2022-06-01T09:13:21.018Z',
                credentialSubject: {
                  id: 'did:ethr:volta:0x06Bdb40FE8bD203aD7Af211ba1fF67f83F09A6D1',
                  role: {
                    version: '1',
                    namespace: 'customer.roles.rebeam.apps.eliagroup.iam.ewc',
                  },
                  issuerFields: [{ key: 'iscustomer', value: 'true' }],
                },
              },
            ],
            warnings: [],
          },
        },
      ],
    };
    const result = service.formatPresentationTableData(data);
    expect(result).toEqual([
      {
        descriptor: 'Energy Supplier Customer Contract',
        credentials: [
          {
            role: 'customer.roles.rebeam.apps.eliagroup.iam.ewc',
            credential: {
              id: 'urn:uuid:88dbacbe-97b1-4a9d-9eff-0a72ca9d85a5',
              type: ['VerifiableCredential', 'EWFRole'],
              proof: {
                type: 'EthereumEip712Signature2021',
                created: '2022-06-01T09:13:21.022Z',
                '@context':
                  'https://w3id.org/security/suites/eip712sig-2021/v1',
                proofValue:
                  '0xd3d66b7b310f6da0813cf5c6c9a1b59b160fe06f81701b337ce17a63b931a2cf30c67d7b4f902f19d3e75f1e3a48af5accd593c09ec6df5b2f5c289a348b4e581b',
                eip712Domain: {
                  domain: {},
                  primaryType: 'VerifiableCredential',
                  messageSchema: {
                    Proof: [
                      { name: '@context', type: 'string' },
                      { name: 'verificationMethod', type: 'string' },
                      { name: 'created', type: 'string' },
                      { name: 'proofPurpose', type: 'string' },
                      { name: 'type', type: 'string' },
                    ],
                    EWFRole: [
                      { name: 'namespace', type: 'string' },
                      { name: 'version', type: 'string' },
                    ],
                    EIP712Domain: [],
                    IssuerFields: [
                      { name: 'key', type: 'string' },
                      { name: 'value', type: 'string' },
                    ],
                    CredentialSubject: [
                      { name: 'id', type: 'string' },
                      { name: 'role', type: 'EWFRole' },
                      { name: 'issuerFields', type: 'IssuerFields[]' },
                    ],
                    VerifiableCredential: [
                      { name: '@context', type: 'string[]' },
                      { name: 'id', type: 'string' },
                      { name: 'type', type: 'string[]' },
                      { name: 'issuer', type: 'string' },
                      { name: 'issuanceDate', type: 'string' },
                      { name: 'credentialSubject', type: 'CredentialSubject' },
                      { name: 'proof', type: 'Proof' },
                    ],
                  },
                },
                proofPurpose: 'assertionMethod',
                verificationMethod:
                  'did:ethr:0x012047:0x2670a5f431f0b444329db18b3bd07ccfe6bf4cf3#controller',
              },
              issuer:
                'did:ethr:0x012047:0x2670a5f431f0b444329db18b3bd07ccfe6bf4cf3',
              '@context': ['https://www.w3.org/2018/credentials/v1'],
              issuanceDate: '2022-06-01T09:13:21.018Z',
              credentialSubject: {
                id: 'did:ethr:volta:0x06Bdb40FE8bD203aD7Af211ba1fF67f83F09A6D1',
                role: {
                  version: '1',
                  namespace: 'customer.roles.rebeam.apps.eliagroup.iam.ewc',
                },
                issuerFields: [{ key: 'iscustomer', value: 'true' }],
              },
            },
            descriptor: 'energy_supplier_customer_contract',
          },
        ],
        selfSign: false,
        descId: 'energy_supplier_customer_contract',
      },
      {
        descriptor: 'Data needs to be signed by the user',
        selfSign: true,
        descId: 'charging_data',
      },
    ] as ICredentialTableData[]);
  });
});
