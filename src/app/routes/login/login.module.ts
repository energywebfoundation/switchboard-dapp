import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login.component';
import { MatCardModule, MatButtonModule, MatDividerModule, MatSelectModule, MatListModule} from '@angular/material';
import { SharedModule } from 'src/app/shared/shared.module';

const routes: Routes = [
  { path: '', component: LoginComponent }
];

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatListModule,
    MatSelectModule,
  ]
})
export class LoginModule { }
