import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ServerViewComponent } from './server-view.component';

const routes: Routes = [
  {
    path:'',
    component:ServerViewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServerViewRoutingModule { }
