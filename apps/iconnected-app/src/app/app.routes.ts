import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import {
  BlobsOverviewComponent,
  RegisterComponent,
  LoginComponent,
  BendesOverviewComponent,
  ProjectsOverviewComponent,
} from '@ihomer/frontend/features';
const appName = 'iConnected | ';

export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    component: BlobsOverviewComponent,
  },
  {
    path: 'blobs',
    pathMatch: 'full',
    component: BlobsOverviewComponent,
    title: `${appName}Blobs`,
  },
  {
    path: 'bendes',
    pathMatch: 'full',
    title: `${appName}Bendes`,
    component: BendesOverviewComponent,
  },
  {
    path: 'projects',
    pathMatch: 'full',
    title: `${appName}Projecten`,
    component: ProjectsOverviewComponent,
  },
  {
    path: 'login',
    pathMatch: 'full',
    component: LoginComponent,
  },
  {
    path: 'deelnemers',
    pathMatch: 'full',
    component: RegisterComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
