import { NgModule } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { DashboardComponent } from './dashboard.component';
import { WidgetsModule } from '../widgets/widgets.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ProfileModule } from '../profile/profile.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatStepperModule } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { UserInfoComponent } from './user-info/user-info.component';


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
        MatFormFieldModule,
        MatCheckboxModule,
        MatStepperModule,
        MatInputModule,
        MatTableModule,
        MatDialogModule,
        MatAutocompleteModule,
        MatDatepickerModule,
        WidgetsModule,
        NgxSpinnerModule,
        ProfileModule
        
        

    ],
    entryComponents: [],

    declarations: [DashboardComponent, UserInfoComponent],
    exports: [
        RouterModule
    ]
})
export class DashboardModule { }