import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import {
  BlobsOverviewComponent,
  RegisterComponent,
  LoginComponent,
  ProfileComponent,
  UpdateProfileComponent,
  BendesOverviewComponent,
  ProjectsOverviewComponent,
  BlobCreateComponent,
  BendeCreateComponent,
  ProjectCreateComponent
} from '@ihomer/frontend/features';
import { LogoutComponent } from '@ihomer/frontend/features';

const appName = 'iConnected | ';
export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'blobs',
  },
  {
    path: 'login',
    pathMatch: 'full',
    component: LoginComponent,
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
    component: BendesOverviewComponent,
    title: `${appName}Bendes`,
  },
  {
    path: 'projects',
    pathMatch: 'full',
    component: ProjectsOverviewComponent,
    title: `${appName}Projecten`,
  },
  {
    path: 'deelnemers',
    pathMatch: 'full',
    component: RegisterComponent,
  },
  {
    path: 'logout',
    pathMatch: 'full',
    title: `${appName}Uitloggen`,
    component: LogoutComponent,
  },
  {
    path: 'blobs/create',
    pathMatch: 'full',
    component: BlobCreateComponent,
    title: `${appName}BlobCreate`,
  },
  {
    path: 'bendes/create',
    pathMatch: 'full',
    component: BendeCreateComponent,
    title: `${appName}BendeCreate`,
  },
  {
    path: 'projects/create',
    pathMatch: 'full',
    component: ProjectCreateComponent,
    title: `${appName}ProjectCreate`,
  },
  {
    path: 'profile',
    pathMatch: 'full',
    component: ProfileComponent,
    title: `${appName}Profiel`,
  },
  {
    path: 'profile/:id',
    pathMatch: 'full',
    component: UpdateProfileComponent,
    title: `${appName}UpdateProfiel`,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
