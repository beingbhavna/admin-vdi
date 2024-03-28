import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    data: {
        title: 'Sever List'
    },
    children: [
        {
            path: '',
            loadChildren: () => import('./server-list/server-list.module').then(m => m.ServerListModule)
        }
    ]
},
{
  path: 'serveradd',
  loadChildren: () =>
  import('./server-add/server-add.module').then(m => m.ServerAddModule)
},
{
  path: ':serverId/serverview',
  loadChildren: () =>
  import('./server-view/server-view.module').then(m => m.ServerViewModule)
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServerRoutingModule { }
