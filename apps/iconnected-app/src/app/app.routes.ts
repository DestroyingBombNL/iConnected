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
    LoggedInAuthGuard,
    AdminAuthGuard,
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
    component: BendesOverviewComponent,
    title: `${appName}Bendes`,
    canActivate: [LoggedInAuthGuard]
  },
  {
    path: 'projects',
    pathMatch: 'full',
    component: ProjectsOverviewComponent,
    title: `${appName}Projecten`,
    canActivate: [LoggedInAuthGuard]
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
        canActivate: [LoggedInAuthGuard, AdminAuthGuard]
    },
    {
      path: 'blobs/:id',
      pathMatch: 'full',
      component: BlobCreateComponent,
      title: `${appName}Blob wijzigen`,
      canActivate: [LoggedInAuthGuard, AdminAuthGuard]
    },
    {
      path: 'bendes/create',
      pathMatch: 'full',
      component: BendeCreateComponent,
      title: `${appName}Bende aanmaken`,
      canActivate: [LoggedInAuthGuard, AdminAuthGuard]
    },
    {
      path: 'bendes/:id',
      pathMatch: 'full',
      component: BendeCreateComponent,
      title: `${appName}Bendes wijzigen`,
      canActivate: [LoggedInAuthGuard, AdminAuthGuard]
    },
    {
      path: 'projects/create',
      pathMatch: 'full',
      component: ProjectCreateComponent,
      title: `${appName}Project aanmaken`,
      canActivate: [LoggedInAuthGuard]
    },
    {
      path: 'projects/:id',
      pathMatch: 'full',
      component: ProjectCreateComponent,
      title: `${appName}Project wijzigen`,
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
