import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'VDI List',
    },
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./vdi-list/vdi-list.module').then((m) => m.VdiListModule),
      },
    ],
  },
  {
    path: 'vdiadd',
    loadChildren: () =>
      import('./vdi-add/vdi-add.module').then((m) => m.VdiAddModule),
  },
  {
    path: ':vdiId/vdiedit',
    loadChildren: () =>
      import('./vdi-edit/vdi-edit.module').then((m) => m.VdiEditModule),
  },
  {
    path: ':vdiId/vdiview',
    loadChildren: () =>
      import('./vdi-view/vdi-view.module').then((m) => m.VdiViewModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VdiRoutingModule {}
