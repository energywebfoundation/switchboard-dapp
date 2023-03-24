import { Component, Input } from '@angular/core';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { ICredentialTableData } from '../models/credential-table-data.interface';
import { IVerifiableCredential } from '@sphereon/pex';
import { MatLegacySelect as MatSelect } from '@angular/material/legacy-select';

@Component({
  selector: 'app-received-presentations',
  templateUrl: './received-presentations.component.html',
  styleUrls: ['./received-presentations.component.scss'],
})
export class ReceivedPresentationsComponent {
  @Input() set tableData(data: ICredentialTableData[]) {
    this.dataSource = new MatTableDataSource<ICredentialTableData>(data);
  }
  @Input() submitDisabled: boolean;
  @Input() requiredCredentials: { [key: string]: IVerifiableCredential };
  displayedColumns: string[] = ['descriptor', 'verification'];
  dataSource = new MatTableDataSource<unknown>([]);

  handleCredentialUpdate(data: MatSelect) {
    this.requiredCredentials[data?.value?.descriptor] = data?.value?.credential;
  }
}
