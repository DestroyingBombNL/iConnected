import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { BlobsOverviewComponent, DeelnemerNewComponent } from '@ihomer/frontend/features';

export const appRoutes: Route[] = [
    {
        path: 'blobs',
        pathMatch: 'full',
        component: BlobsOverviewComponent
    },
    {
        path: 'bendes',
        pathMatch: 'full',
        redirectTo: 'blobs'
    },
    {
        path: 'projects',
        pathMatch: 'full',
        redirectTo: 'blobs'
    },
    {
        path: 'deelnemers',
        pathMatch: 'full',
        component: DeelnemerNewComponent
    }
];


@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule],
})

export class AppRoutingModule {}
