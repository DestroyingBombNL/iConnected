import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { BlobsOverviewComponent, RegisterComponent, LoginComponent } from '@ihomer/frontend/features';
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
        path: 'deelnemers',
        pathMatch: 'full',
        component: RegisterComponent
    },
    {
        path: 'login',
        pathMatch: 'full',
        component: LoginComponent
    },
];


@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule],
})

export class AppRoutingModule {}
