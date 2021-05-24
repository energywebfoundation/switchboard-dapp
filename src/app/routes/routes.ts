import { LayoutComponent } from '../layout/layout.component';
import { AuthGuard } from '../shared/services/auth.guard';
import { LogOutComponent } from './profile/logout/logout.component';
import { RequestClaimComponent } from './registration/request-claim/request-claim.component';

export const routes = [
    {
        path: '',
        component: LayoutComponent,
        canActivate: [AuthGuard],
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule) },
            { path: 'profile', loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule) },
            { path: 'governance', loadChildren: () => import('./applications/applications.module').then(m => m.ApplicationsModule) },
            { path: 'assets', loadChildren: () => import('./assets/assets.module').then(m => m.AssetsModule) },
            { path: 'enrolment', loadChildren: () => import('./enrolment/enrolment.module').then(m => m.EnrolmentModule) },
            { path: 'search-result', loadChildren: () => import('./search-result/search-result.module').then(m => m.SearchResultModule) }
        ]
    },
    {
        path: 'enrol',
        component: RequestClaimComponent
    },
    {
        path: 'welcome',
        children: [
            { path: '', loadChildren: () => import('./welcome/welcome.module').then(m => m.WelcomeModule) }
        ]
    },

    { path: 'logout', component: LogOutComponent},

    // Not found
    { path: '**', redirectTo: 'dashboard' }

];
