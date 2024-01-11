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
    BendeCreateComponent,
    ProjectCreateComponent,
    
} from '@ihomer/frontend/features';
import { LogoutComponent } from '@ihomer/frontend/features';

const appName = 'iConnected | ';
export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
    title: `${appName}Login`
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
    path: 'bendes/:id',
    pathMatch: 'full',
    component: BendeCreateComponent,
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
        title: `${appName}BlobCreate`,
        canActivate: [LoggedInAuthGuard]
    },
    {
      path: 'bendes/create',
      pathMatch: 'full',
      component: BendeCreateComponent,
      title: `${appName}BendeCreate`,
      canActivate: [LoggedInAuthGuard]
    },
    {
      path: 'projects/create',
      pathMatch: 'full',
      component: ProjectCreateComponent,
      title: `${appName}ProjectCreate`,
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
        title: `${appName}UpdateProfiel`,
        canActivate: [LoggedInAuthGuard]
    },
    
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
