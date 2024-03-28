import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VdiListComponent } from './vdi-list.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'demo'
    },
    component: VdiListComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VdiListRoutingModule { }
