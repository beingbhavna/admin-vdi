import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VdiViewComponent } from './vdi-view.component';

const routes: Routes = [
  {
    path: '',
    component: VdiViewComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VdiViewRoutingModule {}
