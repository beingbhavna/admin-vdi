import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VdiAddComponent } from './vdi-add.component';

const routes: Routes = [
  {
    path:'',
    component:VdiAddComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VdiAddRoutingModule { }
