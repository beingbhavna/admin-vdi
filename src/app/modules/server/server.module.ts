import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServerRoutingModule } from './server-routing.module';
import { FilterToggleModule } from 'src/app/directives/filter-toggle/filter-toggle.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ServerRoutingModule,
      FilterToggleModule,
  ]
})
export class ServerModule { }
