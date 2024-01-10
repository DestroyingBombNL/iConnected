import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import {
  BlobsOverviewComponent,
  RegisterComponent,
  LoginComponent,
  BendesOverviewComponent,
  ProjectsOverviewComponent,
    BlobCreateComponent,
    UpdateProfileComponent,
    ProfileComponent, 
} from '@ihomer/frontend/features';
import { LogoutComponent } from '@ihomer/frontend/features';

const appName = 'iConnected | '
export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    component: BlobsOverviewComponent,
  },
  {
    path: 'login',
    pathMatch: 'full',
    component: LoginComponent
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
        title: `${appName}BlobCreate`
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
