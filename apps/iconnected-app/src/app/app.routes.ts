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
    UpdateProfileComponent,
    BendesOverviewComponent,
    ProjectsOverviewComponent,
    BlobCreateComponent,
    LoggedInAuthGuard,
    BendeCreateComponent,
    ProjectCreateComponent,
} from '@ihomer/frontend/features';
import { LogoutComponent } from '@ihomer/frontend/features';

const appName = 'iConnected | ';
export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'blobs',
    title: `${appName}Home`
  },
  {
    path: 'login',
    pathMatch: 'full',
    component: LoginComponent,
    title: `${appName}Login`
  },
  {
    path: 'blobs',
    pathMatch: 'full',
    component: BlobsOverviewComponent,
    title: `${appName}Blobs`,
    canActivate: [LoggedInAuthGuard]
  },
  {
    path: 'bendes',
    pathMatch: 'full',
    title: `${appName}Bendes`,
    component: BendesOverviewComponent,
    title: `${appName}Bendes`,
    canActivate: [LoggedInAuthGuard]
  },
  {
    path: 'projects',
    pathMatch: 'full',
    title: `${appName}Projecten`,
    component: ProjectsOverviewComponent,
    title: `${appName}Projecten`,
    canActivate: [LoggedInAuthGuard]
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
    title: `${appName}Gebruiker toevoegen`,
    canActivate: [LoggedInAuthGuard]
  },
    {
        path: 'logout',
        pathMatch: 'full',
        title: `${appName}Uitloggen`,
        component: LogoutComponent,
        canActivate: [LoggedInAuthGuard]
    },
    {
        path: 'blobs/create',
        pathMatch: 'full',
        component: BlobCreateComponent,
        title: `${appName}Blob aanmaken`,
        canActivate: [LoggedInAuthGuard]
    },
    {
      path: 'bendes/create',
      pathMatch: 'full',
      component: BendeCreateComponent,
      title: `${appName}Bende aanmaken`,
      canActivate: [LoggedInAuthGuard]
    },
    {
      path: 'projects/create',
      pathMatch: 'full',
      component: ProjectCreateComponent,
      title: `${appName}Project aanmaken`,
      canActivate: [LoggedInAuthGuard]
    },
    {
        path: 'profile',
        pathMatch: 'full',
        component: ProfileComponent,
        title: `${appName}Profiel`,
        canActivate: [LoggedInAuthGuard]
    },
    {
        path: 'profile/:id',
        pathMatch: 'full',
        component: UpdateProfileComponent,
        title: `${appName}Profiel wijzigen`,
        canActivate: [LoggedInAuthGuard]
    },
    
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
