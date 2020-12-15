import { NgModule } from '@angular/core';
import { MatButtonModule, MatDialogModule, MatFormFieldModule, MatIconModule, MatInputModule, MatPaginatorModule, MatTableModule, MatTooltipModule, MatSelectModule, MatCheckboxModule, MatStepperModule, MatAutocompleteModule } from '@angular/material';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule, Routes } from '@angular/router';
import { ChartsModule as Ng2ChartsModule } from 'ng2-charts/ng2-charts';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { SharedModule } from 'src/app/shared/shared.module';
import { DashboardComponent } from './dashboard.component';
import { WidgetsModule } from '../widgets/widgets.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ProfileModule } from '../profile/profile.module';


const routes: Routes = [
    { path: '', component: DashboardComponent }
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
        MatStepperModule,
        MatInputModule,
        MatTableModule,
        MatDialogModule,
        MatAutocompleteModule,
        MatDatepickerModule,
        NgxMaterialTimepickerModule,
        WidgetsModule,
        NgxSpinnerModule,
        ProfileModule
        
        

    ],
    entryComponents: [],

    declarations: [DashboardComponent],
    exports: [
        RouterModule
    ]
})
export class DashboardModule { }