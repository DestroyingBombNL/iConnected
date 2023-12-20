import { Route, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { BlobsOverviewComponent } from '@ihomer/frontend/features';

export const appRoutes: Route[] = [
    { //blobsOverview
        path: 'blobs',
        pathMatch: 'full',
        component: BlobsOverviewComponent,
    },
];

NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
