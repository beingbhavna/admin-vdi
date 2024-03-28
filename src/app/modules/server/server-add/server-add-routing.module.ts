import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ServerAddComponent } from './server-add.component';

const routes: Routes = [
  {
    path:'',
    component:ServerAddComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServerAddRoutingModule { }
