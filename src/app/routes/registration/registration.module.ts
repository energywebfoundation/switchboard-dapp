import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { AssetOwnerComponent } from './asset-owner/asset-owner.component';
import { BrpComponent } from './brp/brp.component';
import { DsoComponent } from './dso/dso.component';
import { InstallerComponent } from './installer/installer.component';
import { OemComponent } from './oem/oem.component';
import { TsoComponent } from './tso/tso.component';
import { RegisterComponent, SignInQr } from './register/register.component';
import { RegistrationService } from './registration.service';
import { NgxSpinnerModule } from 'ngx-spinner';
import { GoverningBodyComponent } from './governing-body/governing-body.component';
import { ZXingScannerModule } from '@zxing/ngx-scanner';

/* Use this routes definition in case you want to make them lazy-loaded */
const routes: Routes = [
    { path: 'governing-body', component: GoverningBodyComponent },
    { path: 'asset-owner', component: AssetOwnerComponent },
    { path: 'brp', component: BrpComponent },
    { path: 'dso', component: DsoComponent },
    { path: 'installer', component: InstallerComponent },
    { path: 'oem', component: OemComponent },
    { path: 'tso', component: TsoComponent },
    { path: 'register', component: RegisterComponent }
];


@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(routes),
        RouterModule,
        MatCardModule,
        MatFormFieldModule,
        MatButtonModule,
        MatDividerModule,
        NgxSpinnerModule,
        ZXingScannerModule,
    ],
    declarations: [
        AssetOwnerComponent,
        BrpComponent,
        DsoComponent,
        InstallerComponent,
        OemComponent,
        TsoComponent,
        RegisterComponent,
        GoverningBodyComponent,
        SignInQr
    ],
    entryComponents: [SignInQr],
    providers: [RegistrationService],
    exports: [
        AssetOwnerComponent,
        BrpComponent,
        DsoComponent,
        InstallerComponent,
        OemComponent,
        TsoComponent,
        RegisterComponent,
        GoverningBodyComponent
    ]
})

export class RegistrationModule { }
