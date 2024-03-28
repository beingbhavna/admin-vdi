import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './shared/gaurds/authgaurd/auth.gaurd';
import { PrimaryLayoutComponent } from './modules/layout/primary-layout/primary-layout.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    data: {
      title: 'login',
    },
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./modules/login/login.module').then((m) => m.LoginModule),
      },
    ],
  },
  {
    path: '',
    data: {
      title: 'server',
    },
    component: PrimaryLayoutComponent,
    children: [
      {
        path: 'main',
        loadChildren: () =>
          import('./modules/main/main.module').then((m) => m.MainModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'changepassword',
        loadChildren: () =>
          import('./modules/changepassword/changepassword.module').then(
            (m) => m.ChangepasswordModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: 'edituserprofile',
        loadChildren: () =>
          import('./modules/userprofile/userprofile.module').then(
            (m) => m.UserprofileModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: 'server',
        loadChildren: () =>
          import('./modules/server/server.module').then((m) => m.ServerModule),
      },
      // {
      //   path: 'serveradd',
      //   loadChildren: () =>
      //     import('./modules/server-add/server-add.module').then((m) => m.ServerAddModule),
      // },
      {
        path: 'vdi',
        loadChildren: () =>
          import('./modules/vdi/vdi.module').then((m) => m.VdiModule),
      },
    ],
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
