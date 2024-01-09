import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { 
    BlobsOverviewComponent, 
    RegisterComponent, 
    LoginComponent, 
    ProfileComponent, 
    UpdateProfileComponent 
} from '@ihomer/frontend/features';
import { LogoutComponent } from '@ihomer/frontend/features';

const appName = 'iConnected | '

export const appRoutes: Route[] = [
    {
        path: '',
        pathMatch: 'full',
        component: LoginComponent
    },
    {
        path: 'blobs',
        pathMatch: 'full',
        component: BlobsOverviewComponent,
        title: `${appName}Blobs`
    },
    {
        path: 'bendes',
        pathMatch: 'full',
        redirectTo: 'blobs',
        title: `${appName}Bendes`
    },
    {
        path: 'projects',
        pathMatch: 'full',
        redirectTo: 'blobs',
        title: `${appName}Projecten`
    },
    {
        path: 'login',
        pathMatch: 'full',
        component: LoginComponent,
        title: `${appName}Inloggen`
    },
    {
        path: 'logout',
        pathMatch: 'full',
        component: LogoutComponent,
        title: `${appName}Uitloggen`
    },
    {
        path: 'deelnemers',
        pathMatch: 'full',
        component: RegisterComponent,
        title: `${appName}Deelnemer Registreren`
    },
    {
        path: 'profile',
        pathMatch: 'full',
        component: ProfileComponent,
        title: `${appName}Profiel`
    },
    {
        path: 'profile/:id',
        pathMatch: 'full',
        component: UpdateProfileComponent,
        title: `${appName}UpdateProfiel`
    },
];


@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule],
})

export class AppRoutingModule {}
