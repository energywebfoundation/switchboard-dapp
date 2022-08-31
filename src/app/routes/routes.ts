import { LayoutComponent } from '../layout/layout.component';
import { AuthGuard } from '../shared/services/auth.guard';
import { RequestClaimComponent } from './registration/request-claim/request-claim.component';
import { NgModule } from '@angular/core';
import { NoPreloading, RouterModule } from '@angular/router';
import { RouterConst } from './router-const';

export const routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: RouterConst.Dashboard, pathMatch: 'full' },
      {
        path: RouterConst.Dashboard,
        loadChildren: () =>
          import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
      },
      {
        path: RouterConst.Governance,
        loadChildren: () =>
          import('./applications/applications.module').then(
            (m) => m.ApplicationsModule
          ),
      },
      {
        path: RouterConst.Assets,
        loadChildren: () =>
          import('./assets/assets.module').then((m) => m.AssetsModule)
      },
      {
        path: RouterConst.Enrolment,
        loadChildren: () =>
          import('./enrolment/enrolment.module').then((m) => m.EnrolmentModule),
      },
      {
        path: RouterConst.SearchResult,
        loadChildren: () =>
          import('./search-result/search-result.module').then(
            (m) => m.SearchResultModule
          ),
      },
    ],
  },
  {
    path: RouterConst.Enrol,
    component: RequestClaimComponent,
  },
  {
    path: RouterConst.VerifiablePresentation,
    loadChildren: () =>
      import('./verifiable-presentation/verifiable-presentation.module').then(
        (m) => m.VerifiablePresentationModule
      ),
  },
  {
    path: RouterConst.Welcome,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./welcome/welcome.module').then((m) => m.WelcomeModule),
      },
    ],
  },

  // Not found
  { path: '**', redirectTo: RouterConst.Dashboard },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      onSameUrlNavigation: 'reload',
      relativeLinkResolution: 'legacy',
      useHash: false,
      preloadingStrategy: NoPreloading,
    }),
  ],
  exports: [RouterModule],
})
export class RoutingModule {}
