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
            { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardModule' },
            { path: 'profile', loadChildren: './profile/profile.module#ProfileModule' },
            { path: 'governance', loadChildren: './applications/applications.module#ApplicationsModule' },
            { path: 'enrolment', loadChildren: './enrolment/enrolment.module#EnrolmentModule' },
            { path: 'search-result', loadChildren: './search-result/search-result.module#SearchResultModule' },

            { path: 'templates', loadChildren: './templates/templates.module#TemplatesModule' },
        ]
    },
    {
        path: 'enrol',
        component: RequestClaimComponent
    },
    {
        path: 'welcome',
        children: [
            { path: '', loadChildren: './welcome/welcome.module#WelcomeModule' }
        ]
    },

    { path: 'logout', component: LogOutComponent},

    // Not found
    { path: '**', redirectTo: 'dashboard' }

];
