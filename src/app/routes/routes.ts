import { LayoutComponent } from '../layout/layout.component';
import { AuthGuard } from '../shared/services/auth.guard';
import { RequestClaimComponent } from './registration/request-claim/request-claim.component';
import { NgModule } from '@angular/core';
import { NoPreloading, RouterModule } from '@angular/router';

export const routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
      {path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)},
      {
        path: 'governance',
        loadChildren: () => import('./applications/applications.module').then(m => m.ApplicationsModule)
      },
      {path: 'assets', loadChildren: () => import('./assets/assets.module').then(m => m.AssetsModule)},
      {path: 'enrolment', loadChildren: () => import('./enrolment/enrolment.module').then(m => m.EnrolmentModule)},
      {
        path: 'search-result',
        loadChildren: () => import('./search-result/search-result.module').then(m => m.SearchResultModule)
      },
      {
        path: 'stake',
        loadChildren: () => import('./stake/stake.module').then(m => m.StakeModule)
      }
    ]
  },
  {
    path: 'enrol',
    component: RequestClaimComponent,
  },
  {
    path: 'staking',
    loadChildren: () => import('./ewt-patron/ewt-patron.module').then(m => m.EwtPatronModule)
  },
  {
    path: 'welcome',
    children: [
      {path: '', loadChildren: () => import('./welcome/welcome.module').then(m => m.WelcomeModule)}
    ]
  },

  // Not found
  {path: '**', redirectTo: 'dashboard'}

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      onSameUrlNavigation: 'reload',
      relativeLinkResolution: 'legacy',
      useHash: false,
      preloadingStrategy: NoPreloading
    }),
  ],
  exports: [RouterModule]
})
export class RoutingModule {
}
