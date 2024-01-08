import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { BlobsOverviewComponent, RegisterComponent, LoginComponent, ProfileComponent } from '@ihomer/frontend/features';
const appName = 'iConnected | '

export const appRoutes: Route[] = [
    {
        path: '',
        pathMatch: 'full',
        component: BlobsOverviewComponent
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
        component: LoginComponent
    },
    {
        path: 'deelnemers',
        pathMatch: 'full',
        component: RegisterComponent
    },
    {
        path: 'profile',
        pathMatch: 'full',
        component: ProfileComponent
    },
];


@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule],
})

export class AppRoutingModule {}
