import { NgModule } from '@angular/core';
import { MatButtonModule, MatDialogModule, MatFormFieldModule, MatIconModule, MatInputModule, MatPaginatorModule, MatTableModule, MatTooltipModule, MatSelectModule, MatCheckboxModule, MatStepperModule } from '@angular/material';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule, Routes } from '@angular/router';
import { ChartsModule as Ng2ChartsModule } from 'ng2-charts/ng2-charts';
import { ChartsModule } from '@progress/kendo-angular-charts';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { SharedModule } from 'src/app/shared/shared.module';
import { DashboardComponent } from './dashboard.component';
import { WidgetsModule } from '../widgets/widgets.module';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { GoverningBodyComponent, DialogHistory } from './governing-body/governing-body.component';
import { NgxSpinnerModule } from 'ngx-spinner';


const routes: Routes = [
    { path: '', component: DashboardComponent },
    { path: 'owner', component: GoverningBodyComponent },
    { path: 'installer', component: GoverningBodyComponent },
    { path: 'governing', component: GoverningBodyComponent },
    { path: 'tso', component: GoverningBodyComponent }
];



@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(routes),
        MatTabsModule,
        MatButtonModule,
        MatPaginatorModule,
        MatSelectModule,
        MatIconModule,
        MatTooltipModule,
        Ng2ChartsModule,
        MatFormFieldModule,
        MatCheckboxModule,
        ChartsModule,
        MatStepperModule,
        MatInputModule,
        MatTableModule,
        MatDialogModule,
        MatFormFieldModule,
        MatDatepickerModule,
        NgxMaterialTimepickerModule,
        WidgetsModule,
        ZXingScannerModule,
        NgxSpinnerModule,
        
        

    ],
    entryComponents: [ DialogHistory],

    declarations: [DashboardComponent,  GoverningBodyComponent, DialogHistory],
    exports: [
        RouterModule
    ]
})
export class DashboardModule { }